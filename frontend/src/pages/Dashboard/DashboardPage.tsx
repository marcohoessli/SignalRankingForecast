import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  LinearProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { predictionsAPI, questionsAPI } from '../../services/api';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: predictionsData } = useQuery({
    queryKey: ['my-predictions'],
    queryFn: () => predictionsAPI.getMine(),
  });

  const { data: questionsData } = useQuery({
    queryKey: ['open-questions'],
    queryFn: () => questionsAPI.getAll({ status: 'OPEN', limit: 5 }),
  });

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Predictions
              </Typography>
              <Typography variant="h3">{user?.stats?.total_predictions || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Resolved
              </Typography>
              <Typography variant="h3">{user?.stats?.resolved_predictions || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Avg Brier Score
              </Typography>
              <Typography variant="h3">
                {user?.stats?.avg_brier?.toFixed(4) || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Open Questions */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Open Questions
              </Typography>
              {questionsData?.data?.questions?.map((question: any) => (
                <Box key={question._id} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {question.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Closes: {new Date(question.close_time).toLocaleDateString()}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/questions/${question._id}`}
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Predict Now
                  </Button>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* My Predictions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Recent Predictions
              </Typography>
              {predictionsData?.data?.predictions?.slice(0, 5).map((prediction: any) => (
                <Box key={prediction._id} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="body2" noWrap>
                    {prediction.question_id?.title}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      {prediction.probability}%
                    </Typography>
                    {prediction.brier_score !== undefined && (
                      <Typography variant="body2" color={prediction.brier_score < 0.25 ? 'success.main' : 'error.main'}>
                        {prediction.brier_score.toFixed(3)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
