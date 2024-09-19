import { Pagination as MuiPagination } from '@mui/material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <MuiPagination
      count={totalPages}
      page={currentPage}
      onChange={(_, newPage) => onPageChange(newPage)}
      color="primary"
      sx={{ mt: 2 }}
    />
  );
}
