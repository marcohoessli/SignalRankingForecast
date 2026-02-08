import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Slider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { questionsAPI, predictionsAPI } from '../../services/api';

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [probability, setProbability] = useState(50);

  const { data: questionData, isLoading } = useQuery({
    queryKey: ['question', id],
    queryFn: () => questionsAPI.getById(id!),
    enabled: !!id,
  });

  const predictMutation = useMutation({
    mutationFn: () => predictionsAPI.create(id!, probability),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question', id] });
      alert('Prediction submitted!');
    },
  });

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  const question = questionData?.data?.question;
  if (!question) return <Container>Question not found</Container>;

  const canPredict = question.status === 'OPEN' && new Date(question.close_time) > new Date();

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Chip label={question.category} color="primary" />
                <Chip 
                  label={question.status} 
                  color={question.status === 'OPEN' ? 'success' : 'default'}
                  variant="outlined"
                />
              </Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {question.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
                {question.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Closes: {new Date(question.close_time).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>

          {canPredict && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Make Your Prediction
                </Typography>
                
                {isAuthenticated ? (
                  <>
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="h3" color="primary" gutterBottom>
                        {probability}%
                      </Typography>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        {probability > 50 ? 'Likely YES' : probability < 50 ? 'Likely NO' : 'Even Chance'}
                      </Typography>
                      <Slider
                        value={probability}
                        onChange={(_, value) => setProbability(value as number)}
                        min={0}
                        max={100}
                        step={1}
                        marks={[
                          { value: 0, label: '0%' },
                          { value: 50, label: '50%' },
                          { value: 100, label: '100%' },
                        ]}
                        sx={{ mt: 2 }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption">NO (0%)</Typography>
                        <Typography variant="caption">YES (100%)</Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={() => predictMutation.mutate()}
                      disabled={predictMutation.isPending}
                    >
                      {predictMutation.isPending ? 'Submitting...' : 'Submit Prediction'}
                    </Button>
                  </>
                ) : (
                  <Alert severity="info">
                    Please <Button href="/login">login</Button> to make a prediction
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {question.status === 'RESOLVED' && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Results
                </Typography>
                <Typography variant="body1">
                  Outcome: <strong>{question.outcome}</strong>
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stats
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Predictions: {question.prediction_count || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average: {question.avg_prediction ? `${question.avg_prediction.toFixed(1)}%` : 'N/A'}
              </Typography>
              {question.avg_brier && (
                <Typography variant="body2" color="text.secondary">
                  Avg Brier Score: {question.avg_brier.toFixed(4)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default QuestionDetailPage;
