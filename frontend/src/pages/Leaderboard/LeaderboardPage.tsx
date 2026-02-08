import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Box,
} from '@mui/material';
import { leaderboardAPI } from '../../services/api';

const LeaderboardPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => leaderboardAPI.getAll({ limit: 50 }),
  });

  if (isLoading) {
    return <Container>Loading...</Container>;
  }

  const users = data?.data?.users || [];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Global Leaderboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Ranked by lowest average Brier score (lower is better)
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Forecaster</TableCell>
              <TableCell align="right">Predictions</TableCell>
              <TableCell align="right">Avg Brier Score</TableCell>
              <TableCell align="right">Streak</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: any, index: number) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Chip 
                    label={`#${index + 1}`} 
                    color={index < 3 ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                      {user.name.charAt(0)}
                    </Avatar>
                    {user.name}
                  </Box>
                </TableCell>
                <TableCell align="right">{user.resolved_predictions}</TableCell>
                <TableCell align="right">
                  <Typography 
                    fontWeight="bold"
                    color={user.avg_brier < 0.2 ? 'success.main' : user.avg_brier < 0.3 ? 'warning.main' : 'error.main'}
                  >
                    {user.avg_brier?.toFixed(4) || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell align="right">{user.streak_correct || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LeaderboardPage;
