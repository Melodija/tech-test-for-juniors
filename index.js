const { sendEmail } = require('./emailer');
const { scores, emails } = require('./data');

const didNotSend = [];

const notifyOfExamResults = () => {
  const students = [...scores.reduce((map, student) => 
    map.has(student.name) ? map : map.set(student.name, student), new Map()).values()
  ];
  
  students.map((student) => {
    let candidate = howManyExamsTaken(student.name);
    hasPassed(student.name, getAverageScore(candidate));
  });

  return didNotSend;
};

const howManyExamsTaken = name => {
  return scores.filter(candidate => candidate.name == name )
}

const getAverageScore = student => {
  let totalScore = student.reduce((total, p) => total + p.score, 0);
  return totalScore / student.length;
}

const hasPassed = (name, score) => {
  return score > 50 ? sendPassedEmail(name, score) : sendFailedEmail(name, score)
}

const sendPassedEmail = (name, score) => {
  let email = findStudentEmail(name);
  let emailSentSuccessfully = sendEmail(email, successMessage(capitaliseName(name), score))
  if (!emailSentSuccessfully) return didNotSend.push(email);
};

const sendFailedEmail = (name, score) => {
  let email = findStudentEmail(name);
  let emailSentSuccessfully = sendEmail(email, failureMessage(capitaliseName(name), score))
  if (!emailSentSuccessfully) return didNotSend.push(email);
};

const findStudentEmail = name => {
  let studentEmail = emails.find(emailsList => emailsList.name == name);
  return studentEmail.email;
}

const capitaliseName = name => {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const successMessage = (name, score) => {
  return `Congratulations ${name}, you passed your exams with ${score}%!`;
};

const failureMessage = (name, score) => {
  return `Bad luck ${name}, you failed your exams with ${score}%.`;
};

module.exports = notifyOfExamResults;

