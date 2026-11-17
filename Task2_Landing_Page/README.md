# Task 2 – Responsive E-commerce Landing Page (JTech)

A multi-page, fully responsive website for **JTech**, a demo online shop selling tech gadgets.

## Pages
- **Home** – hero with two overlapping images, featured products and a newsletter sign-up
- **Products** – all 10 products in a responsive grid
- **Why JTech** – the shop's story and four reasons to buy
- **Contact** – contact details and a contact form

## Interactive features (vanilla JavaScript)
- **Add to Cart** – updates the cart counter with a bounce animation, shows a pop-up message naming the product, and briefly changes the button to "Added"
- **Shopping cart panel** – click the bag icon on any page to open a slide-out cart listing each product with its image, price and quantity; change quantities with − / +, remove items, clear the cart, and see an estimated total
- **Cart that remembers** – cart items are saved in `localStorage` (as JSON), so the cart stays the same across pages and visits
- **Newsletter validation** – checks the email and shows red error or green success messages, clearing the error as you type
- **Contact form validation** – checks name, email and message length with Bootstrap error styles

## Responsive design
- Bootstrap 5 grid: 3 products per row on laptops, 2 on tablets, 1 on phones
- Collapsible navbar with the cart always visible
- Newsletter input and button stack on small screens

## Built With
HTML, CSS, Bootstrap 5, JavaScript, Bootstrap Icons, Google Fonts (Poppins)

## How to Run
Open `index.html` in a browser, or run `python3 -m http.server 8000` in this folder and visit http://localhost:8000

## Note
JTech is a demo shop for the SaiKet Systems internship. Product photos are from free stock sites (Unsplash / Pexels), and the contact details are placeholders.

## Screenshots
See the `screenshots/` folder.
