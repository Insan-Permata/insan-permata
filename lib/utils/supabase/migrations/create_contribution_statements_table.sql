-- Sequence for the incremental part of the statement ID
CREATE SEQUENCE IF NOT EXISTS public.contribution_statements_seq;

-- Immutable contribution statements table
CREATE TABLE IF NOT EXISTS public.contribution_statements (
    id            TEXT PRIMARY KEY,                                       -- INSANPERMATA-YEC-{year}-{padded seq}
    user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    email         TEXT NOT NULL,
    donor_name    TEXT,
    year          INTEGER NOT NULL,
    donation_ids  UUID[] NOT NULL,                                        -- snapshot of donation IDs for that year
    total_amount  NUMERIC(15, 2) NOT NULL,                                -- in dollars (e.g. 481.00)
    currency      TEXT NOT NULL DEFAULT 'usd',
    generated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookup by user
CREATE INDEX IF NOT EXISTS contribution_statements_user_idx ON public.contribution_statements(user_id);
CREATE INDEX IF NOT EXISTS contribution_statements_year_idx  ON public.contribution_statements(user_id, year);

-- Enable RLS
ALTER TABLE public.contribution_statements ENABLE ROW LEVEL SECURITY;

-- Users can only view their own statements
CREATE POLICY "Users can view own statements"
    ON public.contribution_statements FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Admins can view all statements
CREATE POLICY "Admins can view all statements"
    ON public.contribution_statements FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Immutability trigger — no updates or deletes allowed
CREATE OR REPLACE FUNCTION public.prevent_statement_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'Contribution statements are immutable and cannot be modified or deleted.';
END;
$$;

CREATE TRIGGER statements_immutable
    BEFORE UPDATE OR DELETE ON public.contribution_statements
    FOR EACH ROW EXECUTE FUNCTION public.prevent_statement_modification();

-- Atomic function to generate the statement ID and insert in one operation.
-- SECURITY DEFINER so it can write to the table bypassing RLS,
-- but it verifies auth.uid() itself to prevent spoofing.
CREATE OR REPLACE FUNCTION public.create_contribution_statement(
    p_email        TEXT,
    p_donor_name   TEXT,
    p_year         INTEGER,
    p_donation_ids UUID[],
    p_total_amount NUMERIC(15, 2),
    p_currency     TEXT DEFAULT 'usd'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_seq     BIGINT;
    v_id      TEXT;
BEGIN
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    v_seq := nextval('public.contribution_statements_seq');
    v_id  := 'INSANPERMATA-YEC-' || p_year || '-' || LPAD(v_seq::TEXT, 6, '0');

    INSERT INTO public.contribution_statements (
        id, user_id, email, donor_name, year, donation_ids, total_amount, currency
    ) VALUES (
        v_id, v_user_id, p_email, p_donor_name, p_year, p_donation_ids, p_total_amount, p_currency
    );

    RETURN v_id;
END;
$$;
