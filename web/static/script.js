/*
File: script.js
Author: Chuncheng Zhang
Date: 2023-06-30
Copyright & Email: chuncheng.zhang@ia.ac.cn

Purpose:
    Amazing things

Functions:
    1. Requirements and constants
    2. Function and class
    3. Play ground
    4. Pending
    5. Pending
*/

// %% ---- 2023-06-30 ------------------------
// Requirements and constants
console.log("d3.js is loaded", d3);

// %% ---- 2023-06-30 ------------------------
// Function and class

/**
 * Randomly generate n cards for the tarot cards.
 *
 * @param {int} n How many card names are required
 * @returns The array of the selected card names
 */
function rndTarotCard(n = 1) {
  const rawCards = `
The Fool
The Magician
The High Priestess
The Empress
The Emperor
The Hierophant
The Lovers
The Chariot
Strength
The Hermit
Wheel of Fortune
Justice
The Hanged Man
Death
Temperance
The Devil
The Tower
The Star
The Moon
The Sun
Judgement
The World
  `,
    cardNames = rawCards
      .split("\n")
      .map((d) => d.trim())
      .filter((d) => d);

  d3.shuffle(cardNames);

  return cardNames.slice(0, n);
}

/**
 * Refresh all the topics
 */
function refreshTopics() {
  d3.json("/queryTopicNames").then((topicNames) => {
    // Refresh the magic card
    {
      const tarot = rndTarotCard()[0];
      d3.select("#magicCard-1").text(tarot);
      document.title = tarot;
    }

    // Clear the #container-1
    document.getElementById("container-1").innerHTML = "";

    /**
     * Request the /queryTopic?topic=[topicName]
     * and add the topic to the #container-1
     */
    topicNames.map((topic) => {
      d3.json("/queryTopic?topic=" + topic).then((talks) => {
        console.log(talks);

        const card = d3
          .select("#container-1")
          .append("div")
          .attr("class", "card")
          .attr("style", "--clr: " + d3.schemeTableau10[d3.randomInt(10)()]);

        card
          .append("div")
          .attr("class", "img-box")
          .append("img")
          .attr(
            "src",
            "https://source.unsplash.com/random?seed=" + d3.randomUniform()()
          );
        //   https://i.postimg.cc/26fms7F7/img-03.png");

        const content = card
          .append("div")
          .attr("class", "content")
          .attr(
            "style",
            "max-height: 400px; overflow-y: scroll; text-align: -webkit-center;"
          );

        content.append("h2").text(topic);

        const _div = content
            .append("div")
            .attr("class", "form__group field")
            .attr("style", "width: 80%"),
          talkInputArea = _div
            .append("input")
            .attr("class", "form__field")
            .attr("style", "--font-color: #333"),
          ol = content.append("ol");

        _div.append("label").text("夸").attr("class", "form__label");

        ol.selectAll("li")
          .data(talks)
          .enter()
          .append("li")
          .text((d) => d[1]);

        talkInputArea.on("keypress", (e) => {
          console.log(e);
          if (e.code === "Enter") {
            e.preventDefault();

            const talk = e.target.value.trim();
            if (talk.length === 0) return;

            // ol.append("li").text(talk);

            d3.json("insertTopicTalk?topic=" + topic + "&talk=" + talk).then(
              (talks) => {
                ol.selectAll("li").data([]).exit().remove();

                ol.selectAll("li")
                  .data(talks)
                  .enter()
                  .append("li")
                  .text((d) => d[1]);
              }
            );

            e.target.value = "";
          }
        });
      });
    });
  });
}

/**
 * Handle the input events
 */
function handleInput() {
  d3.select("#kindWordInput").on("keypress", (e) => {
    console.log(e);
    if (e.code === "Enter") {
      const topic = e.target.value.trim();
      if (topic.length === 0) return;

      d3.json("insertTopicTalk?topic=" + topic).then(() => {
        refreshTopics();
      });

      e.target.value = "";
    }
  });
}

// %% ---- 2023-06-30 ------------------------
// Play ground

// %% ---- 2023-06-30 ------------------------
// Pending

// %% ---- 2023-06-30 ------------------------
// Pending
