document.addEventListener('DOMContentLoaded', function() {
    const visitFormContainer = document.getElementById('visitFormContainer');
    const visitCardsContainer = document.querySelector('.visitCardContainer');
    let cardId = 0;

    function createDoctorFields(doctorType) {
        const additionalFields = document.getElementById('additionalFields');
        additionalFields.innerHTML = '';

        if (doctorType === 'cardiologist') {
            additionalFields.innerHTML = `
                <input type="text" id="bloodPressure" placeholder="Звичайний тиск"><br><br>
                <input type="text" id="bodyMassIndex" placeholder="Індекс маси тіла"><br><br>
                <input type="text" id="heartDiseases" placeholder="Перенесені захворювання серцево-судинної системи"><br><br>
                <input type="text" id="age" placeholder="Вік"><br><br>
            `;
        } else if (doctorType === 'dentist') {
            additionalFields.innerHTML = `
                <input type="text" id="lastVisitDate" placeholder="Дата останнього відвідування"><br><br>
            `;
        } else if (doctorType === 'therapist') {
            additionalFields.innerHTML = `
                <input type="text" id="age" placeholder="Вік"><br><br>
            `;
        }
    }

    function createCloseButton() {
        const closeButton = document.createElement('h1');
        closeButton.innerText = '❌';
        closeButton.classList.add('close-button');
        closeButton.style.cursor = 'pointer';
        closeButton.style.position = 'absolute';
        closeButton.style.left = '320px';
        closeButton.style.top = '20px';

        closeButton.onclick = function() {
            visitFormContainer.style.display = 'none';
        };

        return closeButton;
    }

    function createDeleteButton(visitCard) {
        const deleteButton = document.createElement('span');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = 'delete'; // HTML-код для символу "хрестика"
        deleteButton.style.marginLeft = '940px'
        deleteButton.style.marginTop= '50px'
        deleteButton.style.cursor = 'pointer'
        deleteButton.style.color = 'red'
        deleteButton.style.fontSize = '15px'
        deleteButton.style.textDecoration = 'underline'
        
    
        deleteButton.addEventListener('click', function() {
            visitCardsContainer.removeChild(visitCard);
        });
    
        return deleteButton;
    }

    function createVisitForm() {
        const form = document.createElement('form');
        form.innerHTML = `
            <input type="text" id="fullName" placeholder="ПІБ" required><br><br>
            <input type="text" id="visitPurpose" placeholder="Мета візиту" required><br><br>
            <select id="doctorSelect">
                <option value="cardiologist">Кардіолог</option>
                <option value="dentist">Стоматолог</option>
                <option value="therapist">Терапевт</option>
            </select><br><br>
            <input type="text" id="shortDescription" placeholder="Короткий опис візиту" required><br><br>
            <select id="urgencySelect">
                <option value="звичайна">Звичайна</option>
                <option value="пріоритетна">Пріоритетна</option>
                <option value="невідкладна">Невідкладна</option>
            </select><br><br>
            <div id="additionalFields"></div>
            <button type="submit">Створити</button>
        `;

        form.onsubmit = function(event) {
            event.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const visitPurpose = document.getElementById('visitPurpose').value;
            const doctor = document.getElementById('doctorSelect').value;
            const shortDescription = document.getElementById('shortDescription').value;
            const urgency = document.getElementById('urgencySelect').value;
        
            const visitCard = document.createElement('div');
            visitCard.classList.add('visit-card');
            visitCard.id = `visitCard_${cardId++}`;
            
            visitCard.innerHTML = `
                <p>ПІБ: ${fullName}</p>
                <p>Мета візиту: ${visitPurpose}</p>
                <p>Лікар: ${doctor}</p>
                <p>Короткий опис візиту: ${shortDescription}</p>
                <p>Терміновість: ${urgency}</p>
            `;
            
            const additionalFields = document.getElementById('additionalFields');
            const bloodPressure = document.getElementById('bloodPressure');
            const bodyMassIndex = document.getElementById('bodyMassIndex');
            const heartDiseases = document.getElementById('heartDiseases');
            const age = document.getElementById('age');
            const lastVisitDate = document.getElementById('lastVisitDate');

            if (doctor === 'cardiologist') {
                visitCard.innerHTML += `
                    <p>Звичайний тиск: ${bloodPressure.value || 'Н/Д'}</p>
                    <p>Індекс маси тіла: ${bodyMassIndex.value || 'Н/Д'}</p>
                    <p>Перенесені захворювання: ${heartDiseases.value || 'Н/Д'}</p>
                    <p>Вік: ${age.value || 'Н/Д'}</p>
                `;
            } else if (doctor === 'dentist') {
                visitCard.innerHTML += `
                    <p>Дата останнього відвідування: ${lastVisitDate.value || 'Н/Д'}</p>
                `;
            } else if (doctor === 'therapist') {
                visitCard.innerHTML += `
                    <p>Вік: ${age.value || 'Н/Д'}</p>
                `;
            }

            const deleteButton = createDeleteButton(visitCard);
            visitCard.appendChild(deleteButton);

            visitCardsContainer.appendChild(visitCard);
            visitFormContainer.style.display = 'none';

            const cardData = {
                title: fullName,
                description: visitPurpose,
                doctor,
                // Додайте інші дані для карточки тут
            };

            createCardOnServer(cardData);
        };

        visitFormContainer.appendChild(form);

        const closeButton = createCloseButton();
        visitFormContainer.appendChild(closeButton);

        const doctorSelect = document.getElementById('doctorSelect');
        doctorSelect.addEventListener('change', function() {
            createDoctorFields(doctorSelect.value);
        });
    }


    function createCardOnServer(cardData) {
        fetch('https://ajax.test-danit.com/api/v2/cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer a26e3318-43b7-44b9-9729-7c34ddbc13e7' // Додайте свій токен
            },
            body: JSON.stringify(cardData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Карточка успішно створена:', data);
        })
        .catch(error => {
            console.error('Помилка при створенні карточки:', error);
        });
    }

    createVisitBtn.addEventListener('click', function() {
        visitFormContainer.innerHTML = '';
        createVisitForm();
        createDoctorFields('cardiologist');
        visitFormContainer.style.display = 'flex';
    });
});

