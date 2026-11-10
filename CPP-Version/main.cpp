#include<iostream>
#include<vector>
#include<string>
using namespace std;

class FlightException {
    public:
        string message;
        FlightException(string msg) {
            message = msg;
        }
};

class Flight {
    protected:
        int flightID;
        string flightName;
        string source, destination;
        string date, Time;
        int totalSeat, availableSeat;
        double ticketPrice;
    public:
        void inputFlight() {
         try {
            cout << "Enter flight ID: ";
            cin >> flightID;
            cin.ignore();
            cout << "Enter flight name: ";
            getline(cin, flightName);
            cout << "Enter source: ";
            getline(cin, source);
            cout << "Enter destination: ";
            getline(cin, destination);
            cout << "Enter date: ";
            getline(cin, date);
            cout << "Enter time: ";
            getline(cin, Time);
            cout << "Enter total seats: ";
            cin >> totalSeat;
            cout << "Enter available seats: ";
            cin >> availableSeat;
            if (availableSeat > totalSeat) {
                throw FlightException("Available seats cannot exceed total no. of seats!");
            }
            cout << "Enter ticket price: ";
            cin >> ticketPrice;
            if (ticketPrice < 0) {
                throw FlightException("Invalid Ticket Price!");
            }
         }
         catch(FlightException e) {
            cout << "Error: " << e.message << endl;
         }
        }
        
        void display() {
            cout << "Flight ID: " << flightID << endl;
            cout << "Name: " << flightName << endl;
            cout << "From: " << source << "-> " << destination << endl;
            cout << "Date: " << date << " || " << Time << endl;
            cout << "Available seats: " << availableSeat << "/" << totalSeat << endl;
            cout << "Ticket Price: " << ticketPrice << endl;
        }
        
        int getFlightID() {return flightID;}
        int getAvailableSeat() {return availableSeat;}
        
        string getSource() {return source;}
        string getDestination() {return destination;}
        
        void reduceSeat() {
            if (availableSeat == 0) {
                throw FlightException("Flight is full!");
            } 
            availableSeat--;
        }
        
        void increaseSeat() {
            if (availableSeat > totalSeat) {
                throw FlightException("Available seats cannot exceed total seat");
            }
            availableSeat++;
        }
};

class Airport : public Flight {
    private:
        vector<Flight> flights;
    public:
        void addFlight() {
            Flight f;
            f.inputFlight();
            flights.push_back(f);
            cout << "Flight added successfully!\n";
        }
        void displayFlight() {
            if (flights.empty()) {
                cout << "No flights available!\n";
                return;
            }
            for (auto &f : flights) {
                f.display();
            }
        }
        void deleteFlight() {
            int id;
            cout << "Enter flight ID: ";
            cin >> id;
            for (auto it = flights.begin(); it != flights.end(); it++) {
                if (it->getFlightID() == id) {
                    flights.erase(it);
                    cout << "Flight deleted successfully!\n";
                    return;
                }
            }
            throw FlightException("Flight not found!\n");
        }
        
        vector<Flight> &getFlights() {return flights;}
};

class Booking : public Flight {
    private:
        string name, email;
        long phone;
        int age;
        char gender;
    public:
        void inputPassenger() {
            cin.ignore();
            cout << "Enter name: ";
            getline(cin, name);
            cout << "Enter gender: ";
            cin >> gender;
            cout << "Enter age: ";
            cin >> age;
            cin.ignore();
            cout << "Enter email id: ";
            getline(cin, email);
            cout << "Enter phone no.: ";
            cin >> phone;
        }
        void searchFlight(vector<Flight> &flights) {
            string src, dest;
            cin.ignore();
            cout << "Enter source: ";
            getline(cin, src);
            cout << "Enter destination: ";
            getline(cin, dest);
            
            bool found = false;
            for (auto &f : flights) {
                if (f.getSource() == src && f.getDestination() == dest) {
                    f.display();
                    found = true;
                    return;
                }
            }
            if (!found) {
                throw FlightException("No matching flights available!\n");
            }
        }
        void bookFlight(vector<Flight> &flights) {
            int id;
            cout << "Enter flight ID to book: ";
            cin >> id;
            for (auto &f : flights) {
                if (f.getFlightID() == id) {
                    inputPassenger();
                    f.reduceSeat();
                    cout << "Booking done succesfully!\n";
                    f.display();
                    return;
                }
            }
            throw FlightException("Flight not found!\n");
        }
        void cancelFlight(vector<Flight> &flights) {
            int id;
            cout << "Enter flight ID to cancel: ";
            cin >> id;
            for (auto &f : flights) {
                if (f.getFlightID() == id) {
                    f.increaseSeat();
                    cout << "Flight cancelled succesfully!\n";
                }
            }
            throw FlightException("No flights found!\n");
        }
};

int main() {
    Airport ap;
    Booking bk;
    int choice = -1;
    string option;
    while (choice != 0) {
        try {
            cout << "\n===WELCOME TO AUREVIA AIRLINES===\n";
            cout << "|| Passenger || Employee ||\n";
            cin >> option;
            if (option == "Passenger") {
                cout << "1. Search Flight" << endl;
                cout << "2. Book Flight" << endl;
                cout << "3. Cancel Flight" << endl;
                cout << "0. EXIT\n";
            } else if (option == "Employee") {
                cout << "1. Add Flight" << endl;
                cout << "2. Delete Flight" << endl;
                cout << "3. Display Flights" << endl;
                cout << "0. EXIT\n";
            }
            cout << "Enter choice: ";
            cin >> choice;
            if (choice < 0 || choice > 3) {
                throw FlightException("Invalid choice!");
            }
            
            if (option == "Passenger") {
                switch (choice) {
                    case 1:
                    bk.searchFlight(ap.getFlights());
                    break;
                    case 2:
                    bk.bookFlight(ap.getFlights());
                    break;
                    case 3:
                    bk.cancelFlight(ap.getFlights());
                    break;
                    case 0:
                    cout << "Exiting...";
                    break;
                    default:
                    cout << "Enter correct choice!";
                    break;
                }
            }
            
            if (option == "Employee") {
                switch (choice) {
                    case 1:
                    ap.addFlight();
                    break;
                    case 2:
                    ap.deleteFlight();
                    break;
                    case 3:
                    ap.displayFlight();
                    break;
                    case 0:
                    cout << "Exiting...";
                    break;
                    default:
                    cout << "Enter correct choice!";
                    break;
                }
            }
        }
        catch (FlightException e) {
            cout << "Exception: " << e.message << endl;
        }
    }
    return 0;
}
