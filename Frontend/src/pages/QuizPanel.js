import { Button, Card, Checkbox, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getQuestions } from '../redux/slices/questionSlice';

function QuizPanel() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { accessToken } = useSelector((state) => state.auth);
    const { questions } = useSelector((state) => state.question);
    const currentQuiz = localStorage.getItem("quizID");
    const subject = localStorage.getItem("subjectName");
    const stdName = localStorage.getItem("stdName");
    const stdClass = localStorage.getItem("stdClass");

    const allQuestions = questions.questions.filter((quiz) => quiz.quizID === currentQuiz);
    const [showResult, setShowResult] = useState(true);
    const [index, setIndex] = useState(0);
    const [userAnswer, setAnswer] = useState("");
    const [result, setResult] = useState(0);
    const [realResult, setRealResult] = useState(0);
    const [checked, setChecked] = useState(userAnswer);

    const handleRadionChange = (e) => {
        e.preventDefault();
        setAnswer(e.target.value.toString());
        setChecked(e.target.value);
    };
    const submitAnswer = () => {
        if (userAnswer === allQuestions[index].answer) {
            setResult(result + allQuestions[index].marks);
            setRealResult(realResult + allQuestions[index].marks)
            if (index === allQuestions.length - 1) {
                setShowResult(false);
            } else {
                setIndex(index + 1)
            };
        } else {
            setRealResult(realResult + allQuestions[index].marks)
            if (index === allQuestions.length - 1) {
                setShowResult(false);
            } else {
                setIndex(index + 1);
            };
        }
        setChecked("");
    };

    useEffect(() => {
        dispatch(getQuestions({ accessToken }));
    }, [dispatch, accessToken]);
    return (
        <>
            <Helmet>
                <title> Quiz Panel | CA195 </title>
            </Helmet>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >
                <Typography sx={{ fontSize: 25, fontWeight: "bold", m: "auto auto 4% auto" }}>Welcome to {subject} Quiz</Typography>

                <Grid item xs={3} sx={{ m: "0 auto auto auto" }} hidden={showResult}>
                    <Typography sx={{ fontSize: 30 }}>Quiz Result : </Typography>
                    <Typography sx={{ fontSize: 30 }}>Student Name: <strong>{stdName} .</strong></Typography>
                    <Typography sx={{ fontSize: 30 }}>Student Class: <strong>{stdClass} .</strong></Typography>
                    <Typography sx={{ fontSize: 30 }}>Marks gained: <strong>{result} of {realResult}</strong></Typography>
                </Grid>
                <Grid item xs={3} sx={{ m: "auto" }} hidden={!showResult}>
                    <Card sx={{ mt: "4%", width: 500, height: 200 }}>
                        <Typography sx={{ fontSize: 20 }}>{allQuestions[index].question}</Typography>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            sx={{ display: "grid", gridTemplateColumns: "auto auto", mt: "6%" }}
                            onChange={handleRadionChange}
                            value={checked}
                        >
                            <FormControlLabel value="option1" control={<Radio />} label={allQuestions[index].option1} />
                            <FormControlLabel value="option2" control={<Radio />} label={allQuestions[index].option2} />
                            <FormControlLabel value="option3" control={<Radio />} label={allQuestions[index].option3} />
                            <FormControlLabel value="option4" control={<Radio />} label={allQuestions[index].option4} />
                        </RadioGroup>
                    </Card>
                    <Button variant='contained' sx={{ float: "right", mt: "6%" }} onClick={submitAnswer}>NEXT</Button>
                </Grid>
            </Grid></>
    )
}

export default QuizPanel