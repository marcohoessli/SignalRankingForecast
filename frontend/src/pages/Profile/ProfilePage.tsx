import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Box,
  Chip,
} from '@mui/material';
import { usersAPI } from '../../services/api';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersAPI.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <Container>Loading...</Container>;
  
  const user = data?.data?.user;
  if (!user) return <Container>User not found</Container>;

  return (
    <Container maxWidth="lg">
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ width: 100, height: 100, fontSize: 40, bgcolor: 'primary.main' }}>
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1">
                {user.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                @{user.username || 'no-username'}
              </Typography>
              <Chip 
                label={`Rank #${user.rank_global || 'N/A'}`} 
                color="primary" 
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Predictions</Typography>
              <Typography variant="h4">{user.total_predictions}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Resolved</Typography>
              <Typography variant="h4">{user.resolved_predictions}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Avg Brier</Typography>
              <Typography variant="h4">{user.avg_brier?.toFixed(4) || 'N/A'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Streak</Typography>
              <Typography variant="h4">{user.streak_correct || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
