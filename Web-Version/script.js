let currentRole = '';
let flights = [];

function selectRole(role) {
    currentRole = role;
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('passengerMenu').classList.toggle('active', role === 'Passenger');
    document.getElementById('employeeMenu').classList.toggle('active', role === 'Employee');
    
    hideAllForms();
    clearMessage();
}

function showForm(action) {
    hideAllForms();
    document.getElementById(action + 'Form').classList.add('active');
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
}

function hideAllForms() {
    document.querySelectorAll('.form-container, .flights-list').forEach(form => {
        form.classList.remove('active');
    });
}

function showMessage(text, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div class="message ${type}">${text}</div>`;
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 5000);
}

function clearMessage() {
    document.getElementById('message').innerHTML = '';
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.value = '';
        });
    }
}

function validateFlightData(flightData) {
    if (!flightData.flightID || flightData.flightID <= 0) {
        throw new Error("Invalid Flight ID!");
    }
    if (!flightData.flightName.trim()) {
        throw new Error("Flight name is required!");
    }
    if (!flightData.source.trim() || !flightData.destination.trim()) {
        throw new Error("Source and Destination are required!");
    }
    if (flightData.availableSeat > flightData.totalSeat) {
        throw new Error("Available seats cannot exceed total no. of seats!");
    }
    if (flightData.ticketPrice < 0) {
        throw new Error("Invalid Ticket Price!");
    }
    return true;
}

function addFlight() {
    try {
        const flightData = {
            flightID: parseInt(document.getElementById('flightId').value),
            flightName: document.getElementById('flightName').value,
            source: document.getElementById('flightSource').value,
            destination: document.getElementById('flightDest').value,
            date: document.getElementById('flightDate').value,
            Time: document.getElementById('flightTime').value,
            totalSeat: parseInt(document.getElementById('totalSeats').value),
            availableSeat: parseInt(document.getElementById('availableSeats').value),
            ticketPrice: parseFloat(document.getElementById('ticketPrice').value)
        };

        validateFlightData(flightData);
        
        // Check if flight ID already exists
        if (flights.find(f => f.flightID === flightData.flightID)) {
            throw new Error("Flight ID already exists!");
        }
        
        flights.push({...flightData});
        showMessage('Flight added successfully!', 'success');
        clearForm('addForm');
        hideAllForms();
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

function deleteFlight() {
    try {
        const flightId = parseInt(document.getElementById('deleteFlightId').value);
        const index = flights.findIndex(f => f.flightID === flightId);
        
        if (index === -1) {
            throw new Error("Flight not found!");
        }
        
        flights.splice(index, 1);
        showMessage('Flight deleted successfully!', 'success');
        clearForm('deleteForm');
        hideAllForms();
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

function displayFlights() {
    try {
        if (flights.length === 0) {
            throw new Error("No flights available!");
        }
        displayFlightResults(flights, 'All Flights');
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

function searchFlight() {
    try {
        const source = document.getElementById('searchSource').value.trim().toLowerCase();
        const dest = document.getElementById('searchDest').value.trim().toLowerCase();
        
        if (!source || !dest) {
            throw new Error("Please enter both source and destination!");
        }
        
        const matchingFlights = flights.filter(f => 
            f.source.toLowerCase() === source && 
            f.destination.toLowerCase() === dest
        );

        if (matchingFlights.length === 0) {
            throw new Error('No matching flights available!');
        }

        displayFlightResults(matchingFlights, 'Search Results');
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

function bookFlight() {
    try {
        const flightId = parseInt(document.getElementById('bookFlightId').value);
        const flight = flights.find(f => f.flightID === flightId);
        
        if (!flight) {
            throw new Error("Flight not found!");
        }
        
        if (flight.availableSeat === 0) {
            throw new Error("Flight is full!");
        }

        // Validate passenger data
        const passengerData = {
            name: document.getElementById('passengerName').value.trim(),
            gender: document.getElementById('passengerGender').value,
            age: parseInt(document.getElementById('passengerAge').value),
            email: document.getElementById('passengerEmail').value.trim(),
            phone: document.getElementById('passengerPhone').value
        };

        if (!passengerData.name || !passengerData.gender || !passengerData.email || !passengerData.phone) {
            throw new Error("Please fill all passenger details!");
        }

        // Book the flight
        const flightIndex = flights.findIndex(f => f.flightID === flightId);
        flights[flightIndex].availableSeat--;
        
        showMessage(`Booking successful for ${passengerData.name}!`, 'success');
        clearForm('bookForm');
        displayFlightResults([flights[flightIndex]], 'Booking Confirmation');
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

function cancelFlight() {
    try {
        const flightId = parseInt(document.getElementById('cancelFlightId').value);
        const flight = flights.find(f => f.flightID === flightId);
        
        if (!flight) {
            throw new Error("Flight not found!");
        }
        
        if (flight.availableSeat >= flight.totalSeat) {
            throw new Error("No bookings to cancel!");
        }

        // Cancel booking
        const flightIndex = flights.findIndex(f => f.flightID === flightId);
        flights[flightIndex].availableSeat++;
        
        showMessage('Booking cancelled successfully!', 'success');
        clearForm('cancelForm');
        displayFlightResults([flights[flightIndex]], 'Cancellation Confirmation');
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

function displayFlightResults(flightsList, title) {
    const container = document.getElementById('flightsContainer');
    const listTitle = document.getElementById('listTitle');
    
    listTitle.textContent = title;
    container.innerHTML = '';
    
    flightsList.forEach(flight => {
        const flightCard = document.createElement('div');
        flightCard.className = 'flight-card';
        flightCard.innerHTML = `
            <div class="flight-header">
                <div class="flight-id">ID: ${flight.flightID}</div>
                <div class="flight-route">${flight.source} → ${flight.destination}</div>
            </div>
            <div class="flight-details">
                <div class="flight-detail">
                    <strong>${flight.flightName}</strong>
                </div>
                <div class="flight-detail">
                    📅 ${flight.date} | ⏰ ${flight.Time}
                </div>
                <div class="flight-detail">
                    👥 Seats: ${flight.availableSeat}/${flight.totalSeat}
                </div>
                <div class="flight-detail">
                    💰 ₹${flight.ticketPrice.toFixed(2)}
                </div>
            </div>
        `;
        container.appendChild(flightCard);
    });
    
    document.getElementById('flightsList').classList.add('active');
}

function exitApp() {
    showMessage('Thank you for using Aurevia Airlines! 👋', 'success');
    setTimeout(() => {
        location.reload();
    }, 2000);
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Aurevia Airlines App Loaded Successfully!');
});
