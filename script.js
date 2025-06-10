document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProcessCircle = document.querySelector(".easy-progress");
  const mediumProcessCircle = document.querySelector(".medium-progress");
  const hardProcessCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumlabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-card");

  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username cannot be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert(
        "Invalid username format. Please use alphanumeric characters, underscores, or hyphens (1-15 characters)."
      );
    }
    return isMatching;
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = ((solved / total) * 100).toFixed(2);
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved} / ${total}`;
  }
  function displayUserData(parsedData) {
    const totalQues = parsedData.data.allQuestionsCount[0].count;
    const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
    const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
    const totalHardQues = parsedData.data.allQuestionsCount[2].count;

    const solvedTotalQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
    const solvedTotalEasyQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
    const solvedTotalMediumQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
    const solvedTotalHardQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;


    updateProgress(
      solvedTotalEasyQues,
      totalEasyQues,
      easyLabel,
      easyProcessCircle
    );
    updateProgress(
      solvedTotalMediumQues,
      totalMediumQues,
      mediumlabel,
      mediumProcessCircle
    );
    updateProgress(
      solvedTotalHardQues,
      totalHardQues,
      hardLabel,
      hardProcessCircle
    );


    const cardData = [
        {
            label : "Overall Submissions",
            value :parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions,

        },
        {
            label : "Overall Easy Submissions",
            value :parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions,
            
        },
        {
            label : "Overall Medium Submissions",
            value :parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions,
            
        },
        {
            label : "Overall Hard Submissions",
            value :parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions,
            
        }
    ]
    cardStatsContainer.innerHTML = cardData
  .map(data => `<div class="card">
      <h3>${data.label}</h3>
      <p>${data.value}</p>
    </div>`)
  .join('');

    
  }

  async function fetchUserDetails(username) {
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const proxyUrl = "http://cors-anywhere.herokuapp.com/";
      const targetUrl = `https://leetcode.com/graphql/`;
      const myHeaders = new Headers();
      myHeaders.append("content-type", "application/json");
      const graphql = JSON.stringify({
        query:
          "\n  query userSessionProgress($username: String!) {\n allQuestionsCount{\n difficulty\n count\n }\n matchedUser (username : $username){\n submitStats {\n acSubmissionNum {\n difficulty\n count\n submissions\n }\n totalSubmissionNum {\n difficulty\n  count\nsubmissions\n }\n }\n}\n}\n  ",
        variables: { username: `${username}` },
      });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: graphql,
        redirect: "follow",
      };

      const response = await fetch(proxyUrl + targetUrl, requestOptions);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const parsedData = await response.json();
      console.log("User data: ", parsedData);
      displayUserData(parsedData);
    } catch (error) {
      statsContainer.innerHTML = `<h2 class="error">Error fetching user data: ${error.message}</h2>`;
    } finally {
      searchButton.textContent = "Searching...";
      searchButton.disabled = false;
    }
  }

  searchButton.addEventListener("click", () => {
    const username = usernameInput.value;
    console.log("loging username : ", username);
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
