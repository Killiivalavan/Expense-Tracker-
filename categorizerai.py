from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
import numpy as np

class ExpenseCategorizer:
    def __init__(self):
        self.model = make_pipeline(TfidfVectorizer(), MultinomialNB())
        self.categories = ['Groceries', 'Transportation', 'Entertainment', 'Utilities', 'Dining Out']

    def train(self, descriptions, categories):
        # Convert category names to indices
        category_indices = [self.categories.index(cat) for cat in categories]
        
        # Split the data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(descriptions, category_indices, test_size=0.2, random_state=42)
        
        # Train the model
        self.model.fit(X_train, y_train)
        
        # Evaluate the model
        accuracy = self.model.score(X_test, y_test)
        print(f"Model accuracy: {accuracy:.2f}")

    def predict(self, description):
        # Predict the category index
        category_index = self.model.predict([description])[0]
        
        # Return the category name
        return self.categories[category_index]

# Example usage
categorizer = ExpenseCategorizer()

# Sample data (you would replace this with your actual data)
sample_descriptions = [
    "Bought groceries at Walmart",
    "Uber ride to work",
    "Netflix subscription",
    "Electricity bill",
    "Dinner at a restaurant"
]
sample_categories = ['Groceries', 'Transportation', 'Entertainment', 'Utilities', 'Dining Out']

# Train the model
categorizer.train(sample_descriptions, sample_categories)

# Test the model
new_expense = "Purchased movie tickets"
predicted_category = categorizer.predict(new_expense)
print(f"Predicted category for '{new_expense}': {predicted_category}")