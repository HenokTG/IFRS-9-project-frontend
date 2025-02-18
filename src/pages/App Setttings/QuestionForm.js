import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Stack, Typography, Button, Box, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import { FormProvider, RHFTextField } from 'components/hook-form';

// context and modules
import { axiosInstance } from 'utils/axios';
import { useGlobalContext } from 'contexts/AppContext';
import { questionUpdateFetch } from '_apiAxios/forum-fetch';

// ----------------------------------------------------------------------

export default function QuestionForm() {
  const { loggedIn } = useGlobalContext();

  const navigate = useNavigate();
  const prevLocation = useLocation();

  const { faqID } = useParams();

  const [questionLoading, setQuestionLoading] = useState(true);

  const questionSchema = Yup.object().shape({
    question: Yup.string().required('Question is required'),
  });

  const methods = useForm({
    resolver: yupResolver(questionSchema),
    defaultValues: {
      question: '',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(
    () => {
      if (faqID !== undefined) {
        const updateQuestionAPI = `faq-blog/api/faq/edit-question/${faqID}`;
        questionUpdateFetch(updateQuestionAPI, reset, setQuestionLoading);
      }
    },
    // eslint-disable-next-line
    [reset]
  );

  const onSubmit = async () => {
    const formData = methods.getValues();
    if (faqID === undefined) {
      axiosInstance
        .post(`faq-blog/api/ask-question`, {
          question: formData.question,
        })
        .then(() => {
          navigate('/app-settings/Q-and-A', { replace: true });
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    } else {
      axiosInstance
        .patch(`faq-blog/api/faq/edit-question/${faqID}`, {
          question: formData.question,
        })
        .then(() => {
          navigate('/app-settings/Q-and-A', { replace: true });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Stack spacing={3} sx={{ marginInline: '10%' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', marginBottom: '1rem' }}>
        {faqID === undefined ? 'Ask' : 'Edit'} Question Form
      </Typography>
      {questionLoading && faqID !== undefined ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 15 }}>
          <CircularProgress />
        </Box>
      ) : (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <RHFTextField
              name="question"
              label={`${faqID === undefined ? 'Write' : 'Update'} your question`}
              autoFocus
              multiline
              minRows={10}
              maxRows={20}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 20 }}>
              <Button
                fullWidth
                size="large"
                variant="outlined"
                color="error"
                onClick={() => navigate('/app-settings/Q-and-A')}
              >
                Cancel
              </Button>
              <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                {faqID === undefined ? 'Submit' : 'Update'} Question
              </LoadingButton>
            </Box>
          </Stack>
        </FormProvider>
      )}
    </Stack>
  );
}
