import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { questionsAPI, leaderboardAPI } from '../../services/api';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  const { data: questionsData } = useQuery({
    queryKey: ['questions-preview'],
    queryFn: () => questionsAPI.getAll({ status: 'OPEN', limit: 3 }),
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ['leaderboard-preview'],
    queryFn: () => leaderboardAPI.getAll({ limit: 5 }),
  });

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Predict. Track. Compete.
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Make accurate predictions on real-world events
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
            No gambling. No money. Just pure accuracy.
          </Typography>
          {!isAuthenticated ? (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                size="large"
                sx={{ bgcolor: 'white', color: 'primary.main' }}
              >
                Get Started Free
              </Button>
              <Button
                component={Link}
                to="/questions"
                variant="outlined"
                size="large"
                sx={{ borderColor: 'white', color: 'white' }}
              >
                Browse Questions
              </Button>
            </Box>
          ) : (
            <Button
              component={Link}
              to="/dashboard"
              variant="contained"
              size="large"
              sx={{ bgcolor: 'white', color: 'primary.main' }}
            >
              Go to Dashboard
            </Button>
          )}
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Active Questions */}
        <Typography variant="h4" component="h2" gutterBottom>
          Active Questions
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {questionsData?.data?.questions?.map((question: any) => (
            <Grid item xs={12} md={4} key={question._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip label={question.category} color="primary" size="small" />
                    <Chip label={question.status} color="success" size="small" variant="outlined" />
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {question.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {question.description.substring(0, 100)}...
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {question.prediction_count || 0} predictions
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={50}
                    sx={{ mt: 2 }}
                  />
                  <Button
                    component={Link}
                    to={`/questions/${question._id}`}
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    View & Predict
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Leaderboard Preview */}
        <Typography variant="h4" component="h2" gutterBottom>
          Top Forecasters
        </Typography>
        <Grid container spacing={3}>
          {leaderboardData?.data?.users?.slice(0, 3).map((user: any, index: number) => (
            <Grid item xs={12} md={4} key={user.id}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" color="primary" gutterBottom>
                    #{index + 1}
                  </Typography>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Brier: {user.avg_brier?.toFixed(4) || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.resolved_predictions} predictions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
