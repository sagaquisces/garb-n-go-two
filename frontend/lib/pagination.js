import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo custom implementation
    read(existing = [], { args, cache }) {
      const { skip, first } = args;
      // read number of items in cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // if there are items and there aren't enough to satisy
      // how many are requested and we are on last page, send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // we need to go to network to fetch.
        return false;
      }

      // if there are items return from cache
      if (items.length) {
        return items;
      }

      return false; // fallback to network
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      return merged;
    },
  };
}
