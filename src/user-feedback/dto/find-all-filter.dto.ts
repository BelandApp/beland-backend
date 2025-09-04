export type FindAllFilters = {
  page: number;
  limit: number;
  user_id?: string;
  section?: string;
  rating?: number;
  platform?: string;
}