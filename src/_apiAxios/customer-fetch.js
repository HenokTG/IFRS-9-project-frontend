import { axiosInstance } from '../utils/axios';

// ----------------------------------------------------------------------

export const fetchUsers = (setLoading, setUSERLIST) => {
  axiosInstance
    .get(`users/api/profiles`)
    .then((res) => {
      const USERLIST = res.data.map((profile) => ({
        id: profile.username,
        imageUrl: profile.image,
        user: profile.username,
        name: `${profile.first_name ? profile.first_name : ''} ${profile.last_name ? profile.last_name : ''}`,
        department: profile.Department ? profile.Department : '-',
        jobTitle: profile.Job_title ? profile.Job_title : '-',
        phone: '+251 920 80 9496',
        // `+251 ${profile.phone.toString().slice(0, 3)} ${profile.phone.toString().slice(3, 5)} ${profile.phone
        //   .toString()
        //   .slice(5)}`,
        email: profile.email ? profile.email : '-',
        privilage: profile.is_superuser ? 'Admin' : 'Staff',
        avatarUrl: `/static/mock-images/avatars/avatar_default.jpg`,
      }));
      console.log(res.data);
      setLoading(false);
      setUSERLIST(USERLIST);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
      setUSERLIST([]);
    });
};

export const questionAndAnswer = (fetchAPI, setLoading, setQuestionsList, setPaginationProps) => {
  axiosInstance
    .get(fetchAPI)
    .then((res) => {
      if (typeof setPaginationProps === 'function') {
        setPaginationProps(res.data?.pagination);
      }

      const QnALIST = res.data.results?.map((QnA) => ({
        questionID: QnA.id,
        questionTime: new Date(QnA.question_time),
        question: QnA.question === null ? [] : QnA.question.replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n'),
        questionerUser: QnA.questioner_user,
        questionerBank: QnA.questioner_bank,
        questionUpvotes: QnA.question_upvotes,
        isMyQuestion: QnA.is_my_question,
        isQuestionUpvoted: QnA.is_question_upvoted,
        isAnswerd: QnA.is_answered,
        answerTime: QnA.answer_time,
        fullAnswer: QnA.answer === null ? [] : QnA.answer.replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n'),
        isAnswerLiked: QnA.is_answer_liked,
        answerLikes: QnA.answer_likes,
        isAnswerDisliked: QnA.is_answer_disliked,
        answerDislikes: QnA.answer_dislikes,
      }));

      setLoading(false);
      setQuestionsList(QnALIST);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
      setQuestionsList([]);
    });
};

export const questionUpdateFetch = (updateQuestionAPI, setIntialQuestion, setQuestionLoading) => {
  axiosInstance
    .get(updateQuestionAPI)
    .then((res) => {
      setIntialQuestion({
        question: res.data?.question,
      });
      setQuestionLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setQuestionLoading(false);
    });
};

export const manageFAQRatings = (faqID, boolVal, bottonAction, setChangeId) => {
  const ratingManagementAPI = `faq-blog/api/faq/${faqID}/${bottonAction}/${boolVal ? 'down' : 'up'}`;

  axiosInstance
    .get(ratingManagementAPI)
    .then(setChangeId(`${faqID}-${boolVal}-${Date.now()}-${bottonAction}`))
    .catch((error) => {
      console.log(error);
    });
};
