const addCards = (items) => {
  $("#card-section").empty();

  items.forEach((item) => {
    const itemToAppend = `
      <div class="col s12 m6 l4 center-align">
        <div class="card small-card">
          <div class="card-image waves-effect waves-block waves-light">
            <img class="activator" src="${item.image}" alt="${item.topicName}">
          </div>

          <div class="card-content">
            <span class="card-title activator grey-text text-darken-4">
              ${item.topicName}
              <i class="material-icons right">more_vert</i>
            </span>
            <p><a href="#!">${item.resourceText}</a></p>
            <p><strong>Level:</strong> ${item.difficulty}</p>
          </div>

          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">
              ${item.topicName}
              <i class="material-icons right">close</i>
            </span>
            <p>${item.details}</p>
          </div>
        </div>
      </div>
    `;

    $("#card-section").append(itemToAppend);
  });
};

const getCards = async () => {
  try {
    const response = await fetch("/api/cards");
    const result = await response.json();

    if (result.statusCode === 200) {
      addCards(result.data);
    } else {
      console.error("Failed to load cards");
    }
  } catch (error) {
    console.error("Error fetching cards:", error);
  }
};

const submitForm = () => {
  const formData = {
    first_name: $("#first_name").val(),
    last_name: $("#last_name").val(),
    password: $("#password").val(),
    email: $("#email").val()
  };

  console.log("Form Data Submitted:", formData);
};

$(document).ready(() => {
  $(".materialboxed").materialbox();
  $(".modal").modal();

  $("#topicForm").on("submit", (event) => {
    event.preventDefault();
    submitForm();
  });

  getCards();
});