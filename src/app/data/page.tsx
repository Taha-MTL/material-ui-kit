'use client';

import { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Pagination as MuiPagination, Paper, Typography } from '@mui/material';

import Pagination from '../../components/data/Pagination';

interface Item {
  id: number;
  name: string;
}

interface PaginatedResponse {
  page: number;
  limit: number;
  totalPages: number;
  data: Item[];
}

export default function PaginatedDataPage() {
  const [data, setData] = useState<Item[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = async (page: number) => {
    const response = await fetch(`/api/data?page=${page}&limit=10`);
    const result: PaginatedResponse = await response.json();
    setData(result.data);
    setTotalPages(result.totalPages);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Paginated Data
        </Typography>
        <List>
          {data.map((item) => (
            <ListItem key={item.id}>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
        <MuiPagination count={totalPages} page={page} onChange={(_, newPage) => setPage(newPage)} sx={{ mt: 2 }} />
      </Paper>
    </Box>
  );
}
