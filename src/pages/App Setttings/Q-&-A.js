import { format } from 'date-fns';

import { useState, useEffect } from 'react';
import { NavLink as RouterLink, useNavigate, useLocation } from 'react-router-dom';

// @mui
import {
  Card,
  Box,
  Grid,
  Container,
  Button,
  TextField,
  Typography,
  InputAdornment,
  SvgIcon,
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

// components
import ReportLoading from '../Reports/helper-modules/reportLoading';

// icons
import { Ask } from '../../icons/ask-question';
import { Edit } from '../../icons/edit';
import { Delete } from '../../icons/delete';
import { Raise } from '../../icons/raise-hand';
import { SolidRaise } from '../../icons/filled-raise-hand';
import { Dislike } from '../../icons/dislike';
import { SolidDislike } from '../../icons/filled-dislike';
import { Like } from '../../icons/like';
import { SolidLike } from '../../icons/filled-like';
import { Search as SearchIcon } from '../../icons/search';

// context and modules
import { axiosInstance } from '../../utils/axios';
import { useGlobalContext } from '../../context';
import { questionAndAnswer, manageFAQRatings } from '../../_apiAxios/customer-fetch';

// custom styles

const CustomAccordion = styled((props) => <Accordion disableGutters elevation={0} square {...props} />)(
  ({ theme }) => ({
    border: `1px solid ${theme.palette.info.light}`,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    // '&:not(:last-child)': {
    //   borderBottom: 0,
    // },
    '&:before': {
      display: 'none',
    },
  })
);

const CustomAccordionSummary = styled((props) => (
  <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '1.25rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : theme.palette.info.lighter,
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(-90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(2),
    // marginRight: theme.spacing(1),
  },
}));

const CustomAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
  borderBottom: '1px solid rgba(0, 0, 0, .05)',
}));

// ----------------------------------------------------------------------

export default function QuestionAnswer() {
  const { loggedIn } = useGlobalContext();

  const navigate = useNavigate();
  const prevLocation = useLocation();

  const [loading, setLoading] = useState(true);

  const [expanded, setExpanded] = useState('int');

  const [page, setPage] = useState(1);
  const [questionsList, setQuestionsList] = useState([]);
  const [paginationProps, setPaginationProps] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  const numberOfPages = paginationProps !== null ? paginationProps.num_pages : -1;

  const [ratedId, setRatedId] = useState('');
  const [deletedID, setDeletedID] = useState('');

  useEffect(
    () => {
      if (loggedIn === false) {
        navigate(`/login?redirectTo=${prevLocation.pathname}`, { replace: true });
      }

      const fetchAPI = `faq-blog/api/list-question-answer?page_num=${page}`;

      questionAndAnswer(fetchAPI, setLoading, setQuestionsList, setPaginationProps);
    },
    // eslint-disable-next-line
    [page, ratedId, deletedID]
  );

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleExpand = (panelID) => (event, newExpanded) => {
    setExpanded(newExpanded ? panelID : false);
  };

  const searchAction = (e) => {
    setSearchQuery(e.target.value);

    const searchValue = e.target.value;
    const fetchAPI = `faq-blog/api/list-question-answer?search=${searchValue}&page_num=${page}`;

    questionAndAnswer(fetchAPI, setLoading, setQuestionsList, setPaginationProps);
  };

  const handelDeleteOperator = (faqID) => {
    axiosInstance
      .delete(`faq-blog/api/faq/delete-question/${faqID}`)
      .then(setDeletedID(faqID))
      .catch((error) => {
        console.log(error);
      });
  };

  const isDataNotFound = questionsList.length === 0;

  return (
    <Box component="main">
      <Container maxWidth={false}>
        <Typography variant="h3" sx={{ m: 2, mb: 4 }}>
          Questions and Answers
        </Typography>

        <Card sx={{ mt: 1, mx: 5, p: 3 }}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ padding: 2, pb: 2.5 }}
          >
            <Grid item md={10}>
              <Box sx={{ maxWidth: 400 }}>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon color="action" fontSize="small">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search questions"
                  variant="outlined"
                  color="success"
                  onChange={searchAction}
                />
              </Box>
            </Grid>

            <Grid item md={2}>
              <RouterLink to="ask">
                <Button startIcon={<Ask />} color="primary" variant="contained">
                  Ask Question
                </Button>
              </RouterLink>
            </Grid>
          </Grid>
          {loading ? (
            <Box sx={{ maxHeight: 10, mt: -5 }}>
              <ReportLoading />
            </Box>
          ) : (
            <Box>
              {questionsList.map((QnA) => (
                <CustomAccordion
                  key={QnA.questionID}
                  expanded={expanded === QnA.questionID}
                  onChange={handleExpand(QnA.isAnswerd ? QnA.questionID : 'no answer')}
                >
                  <CustomAccordionSummary
                    aria-controls={`${QnA.questionID}-content`}
                    id={`${QnA.questionID}-header`}
                    sx={{
                      backgroundColor: QnA.isAnswerd ? 'info.lighter' : 'warning.lighter',
                    }}
                  >
                    <Grid container spacing={3} direction="row" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Grid item lg={8.5}>
                        <Grid container spacing={1}>
                          <Grid item lg={12}>
                            {QnA.question.map((paragraph, idx) => (
                              <Typography variant="body2" key={idx} sx={{ mb: 1 }}>
                                {paragraph}
                              </Typography>
                            ))}
                          </Grid>
                          <Grid item lg={6}>
                            <Typography variant="subtitle2">Questioner: {QnA.questionerUser}</Typography>
                          </Grid>
                          <Grid item lg={6}>
                            <Typography variant="subtitle2" align="right">
                              Bank: {QnA.questionerBank}
                            </Typography>
                          </Grid>
                          <Grid item lg={6}>
                            <Typography variant="caption" align="right">
                              Time: {format(QnA.questionTime, 'dd MMM, yyyy  HH:MM:SS')}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={1}>
                        {!QnA.isMyQuestion ? (
                          <Button
                            color="success"
                            size="small"
                            onClick={() =>
                              manageFAQRatings(QnA.questionID, QnA.isQuestionUpvoted, 'question_upvote', setRatedId)
                            }
                          >
                            {QnA.isQuestionUpvoted ? <SolidRaise /> : <Raise />}
                          </Button>
                        ) : (
                          <Box
                            sx={
                              QnA.isAnswerd
                                ? { display: 'none' }
                                : {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'space-between',
                                    gap: 2,
                                  }
                            }
                          >
                            <RouterLink to={`edit/${QnA.questionID}`}>
                              <Button color="success" size="small">
                                <Edit />
                              </Button>
                            </RouterLink>
                            <Button color="error" size="small" onClick={() => handelDeleteOperator(QnA.questionID)}>
                              <Delete />
                            </Button>
                          </Box>
                        )}
                      </Grid>
                      <Grid item lg={2.5}>
                        <Typography variant="h4" align="right" color={QnA.isAnswerd ? 'warning.main' : 'info.light'}>
                          {QnA.questionUpvotes}
                        </Typography>
                        <Typography variant="body2" align="right">
                          people raised same question.
                        </Typography>
                      </Grid>
                    </Grid>
                  </CustomAccordionSummary>
                  <CustomAccordionDetails>
                    {QnA.fullAnswer.map((paragraph, idx) => (
                      <Typography variant="body1" key={idx} sx={{ mb: 1 }}>
                        {paragraph}
                      </Typography>
                    ))}
                  </CustomAccordionDetails>
                  <AccordionActions>
                    <Grid container spacing={1} sx={{ px: 5 }}>
                      <Grid item lg={8}>
                        <Typography variant="caption" align="left" color="info.main">
                          Answer Time:{' '}
                          {QnA.answerTime === null ? '' : format(new Date(QnA.answerTime), 'dd MMM, yyyy  HH:MM:SS')}
                        </Typography>
                      </Grid>
                      <Grid item lg={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Button
                            color="warning"
                            onClick={() =>
                              manageFAQRatings(QnA.questionID, QnA.isAnswerDisliked, 'answer_dislike', setRatedId)
                            }
                          >
                            {QnA.isAnswerDisliked ? <SolidDislike /> : <Dislike />}
                          </Button>
                          <Typography variant="h5" color="warning.main" sx={{ mx: 1 }}>
                            {QnA.answerDislikes}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Button
                            color="error"
                            onClick={() =>
                              manageFAQRatings(QnA.questionID, QnA.isAnswerLiked, 'answer_like', setRatedId)
                            }
                          >
                            {QnA.isAnswerLiked ? <SolidLike /> : <Like />}
                          </Button>
                          <Typography variant="h5" align="right" color="error.main" sx={{ mx: 1 }}>
                            {QnA.answerLikes}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionActions>
                </CustomAccordion>
              ))}

              {isDataNotFound && (
                <Box sx={{ my: 6 }}>
                  <Typography gutterBottom align="center" variant="subtitle1" color="error.main">
                    No question fetched!
                  </Typography>
                  <Typography variant="body2" align="center" color="warning.main">
                    No results found for &nbsp;
                    <strong style={{ color: 'success.light' }}>&quot;{searchQuery}&quot;</strong>. Try checking for
                    typos or internet connection.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 5,
              mb: 1,
            }}
          >
            <Pagination
              count={numberOfPages}
              page={page}
              size="large"
              variant="outlined"
              color="secondary"
              hideNextButton={!paginationProps?.has_next}
              hidePrevButton={!paginationProps?.has_previous}
              showFirstButton={paginationProps?.has_previous}
              showLastButton={paginationProps?.has_next}
              onChange={handlePageChange}
            />
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
