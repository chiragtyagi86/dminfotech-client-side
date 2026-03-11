// src/hooks/useApi.js
// ─────────────────────────────────────────────────────────────────────────────
// Generic data-fetching hook. Works with any api.* function.
//
// Usage:
//   const { data, loading, error } = useApi(() => api.getPosts());
//   const { data, loading, error } = useApi(() => api.getPost(slug), [slug]);
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";

// ── useApi — read-only fetching ───────────────────────────────────────────────

export function useApi(fetcher, deps = []) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetcher()
      .then((d)  => { if (!cancelled) setData(d);           })
      .catch((e) => { if (!cancelled) setError(e.message);  })
      .finally(() => { if (!cancelled) setLoading(false);   });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

// ── useApiMutation — for POST / PUT / DELETE actions ─────────────────────────
//
// Usage:
//   const { mutate, loading, error, data } = useApiMutation(api.submitLead);
//   <button onClick={() => mutate({ name, email, message })}>Send</button>

export function useApiMutation(mutationFn) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [success, setSuccess] = useState(false);

  const mutate = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await mutationFn(...args);
      setData(result);
      setSuccess(true);
      return result;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setSuccess(false);
  }, []);

  return { mutate, loading, error, data, success, reset };
}

// ── usePaginatedApi — for paginated admin tables ──────────────────────────────
//
// Usage:
//   const { data, loading, error, page, setPage, total, pages } =
//     usePaginatedApi((p) => adminApi.getLeads({ page: p, limit: 20 }));

export function usePaginatedApi(fetcher, initialPage = 1) {
  const [page,    setPage]    = useState(initialPage);
  const [data,    setData]    = useState([]);
  const [meta,    setMeta]    = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetcher(page)
      .then((res) => {
        if (!cancelled) {
          setData(res.data ?? res);
          setMeta(res.meta ?? { total: 0, pages: 1 });
        }
      })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return { data, loading, error, page, setPage, total: meta.total, pages: meta.pages };
}