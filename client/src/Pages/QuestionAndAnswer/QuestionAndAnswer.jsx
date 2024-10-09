import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../utility/axios";
import Layout from "../../Layout/Layout";
import styles from "./answer.module.css";
import { MdAccountCircle } from "react-icons/md";
import { FaClipboardQuestion } from "react-icons/fa6";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import moment from "moment";
import { UserState } from "../../App";
import { LuCalendarClock } from "react-icons/lu";
import Swal from "sweetalert2";


function QuestionAndAnswer() {
  const [questionDetails, setQuestionDetails] = useState({});
  const { user } = useContext(UserState);
  const userId = user?.userid;
  const { questionId } = useParams(); // Retrieves the `id` from the URL
  const [loading, setLoading] = useState(true);
  const answerInput = useRef();
  // Retrieves the value of 'id' from the query string
  useEffect(() => {
    axiosInstance.get(`/question/${questionId}`).then((res) => {
      console.log(res.data);
      setQuestionDetails(res.data);
    });
  }, [questionId]);

  async function handlePostAnswer(e) {
    e.preventDefault();
    const response = await axiosInstance.post("/answer", {
      userid: userId,
      answer: answerInput.current.value,
      questionid: questionId,
    });
    try {
      if (response.status === 201) {
        console.log("Question created successfully");
        await Swal.fire({
          title: "Success!",
          text: "Answer submitted successfully!",
          icon: "success",
          confirmButtonText: "OK"
        }).then(() => {
          window.location.reload();
        });
      } else {
        console.error("Failed to post answer");
      await Swal.fire({
        title: "Error",
        text: "Failed to post answer",
        icon: "error",
        confirmButtonText: "OK"
      });
      }
    } catch (error) {
      console.error(error);
    await Swal.fire({
      title: "Error",
      text: "Failed to post answer. Please try again later.",
      icon: "error",
      confirmButtonText: "OK"
    });
    }
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div style={{ display: "flex" }}>
            <div>
              <FaClipboardQuestion size={35} style={{ marginRight: "10px" }} />
            </div>
            <div>
              <h1 className={styles.questionTitle}>{questionDetails?.title}</h1>
              <p className={styles.questionDescription}>
                {questionDetails?.description}
              </p>
              <p className={styles.question_date}>
                <LuCalendarClock style={{marginRight:"5px"}} size={19}/>
              {moment(questionDetails.qtn_createdAt).format('ddd, MMM DD, YYYY h:mm A').toUpperCase()}
              </p>

            </div>
          </div>

          <section className={styles.answerSection}></section>
          <h2
            style={{ padding: "5px 0", textAlign: "left", fontWeight: "600" }}
          >
            <MdOutlineQuestionAnswer
              size={35}
              style={{ marginRight: "10px" }}
            />
            Answers From the Community:
          </h2>
          {questionDetails?.answers?.length > 0 ? (
            questionDetails?.answers?.map((answer) => ( 
              <div key={answer?.answerid} className={styles.answer_holder}>
                <div className={styles.account_holder}>
                  <MdAccountCircle size={50} />
                  <div className={styles.profileName}>@{answer?.username}</div>
                </div>
                <div>
                  <p className={styles.answerText}>{answer?.answer}</p>
                  <p className={styles.answer_date}>
                  <LuCalendarClock style={{marginRight:"5px"}} size={19}/>
                    {moment(answer?.createdAt).format('ddd, MMM DD, YYYY h:mm A').toUpperCase()}</p>
                </div>
              </div>
            ))
          ) : (
            <p>
              <span style={{ color: "red", fontWeight: "bold" }}>
                No answers yet!
              </span>{" "}
              <br /> Be the first to contribute your answer and help the
              community.
            </p>
          )}

          <section className={styles.answerFormSection}>
            <h3 className={styles.answerFormTitle}>Answer The Top Question</h3>
            <Link to="/" className={styles.questionPageLink}>
              Go to Question page
            </Link>
            <form onSubmit={handlePostAnswer}>
              <textarea
                placeholder="Your Answer..."
                className={styles.answerInput}
                required
                ref={answerInput}
              />
              <button className={styles.postAnswerButton} type="submit">
                Post Your Answer
              </button>
            </form>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default QuestionAndAnswer;
