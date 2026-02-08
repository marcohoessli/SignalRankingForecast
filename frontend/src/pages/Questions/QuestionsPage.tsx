import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { questionsAPI } from '../../services/api';

const categories = ['All', 'Crypto', 'Politics', 'Tech', 'Sports', 'Other'];
const statuses = ['All', 'OPEN', 'CLOSED', 'RESOLVED'];

const QuestionsPage: React.FC = () => {
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['questions', category, status, search],
    queryFn: () => questionsAPI.getAll({
      category: category !== 'All' ? category : undefined,
      status: status !== 'All' ? status : undefined,
      search: search || undefined,
    }),
  });

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Browse Questions
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          {statuses.map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 200 }}
        />
      </Box>

      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={3}>
          {data?.data?.questions?.map((question: any) => (
            <Grid item xs={12} md={6} lg={4} key={question._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip 
                      label={question.category} 
                      color="primary" 
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <Chip 
                      label={question.status} 
                      color={question.status === 'OPEN' ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {question.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {question.description.substring(0, 120)}...
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Closes: {new Date(question.close_time).toLocaleDateString()}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/questions/${question._id}`}
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default QuestionsPage;
