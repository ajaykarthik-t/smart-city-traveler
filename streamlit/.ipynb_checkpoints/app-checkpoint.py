# Your Streamlit code here
import streamlit as st
import matplotlib.pyplot as plt
from keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import google.generativeai as genai
from PIL import Image

GOOGLE_API_KEY = "AIzaSyDeOU6vNwAo3HflrO6ETjXvApqI2VK9-6Q"

# Configure the API client
genai.configure(api_key=GOOGLE_API_KEY)

# Load the trained model
model = load_model('my_model.keras')

# Define class names for the 15 monuments
class_names = [
    'Sun Temple Konark', 'alai_darwaza', 'alai_minar', 'basilica_of_bom_jesus', 
    'charminar', 'golden temple', 'hawa mahal pics', 'iron_pillar', 
    'jamali_kamali_tomb', 'lotus_temple', 'mysore_palace', 'qutub_minar', 
    'tajmahal', 'tanjavur temple', 'victoria memorial'
]

# Function to get detailed information from the Gemini API
def get_class_details(predicted_class):
    try:
        response = genai.GenerativeModel('gemini-pro').generate_content(
            f"Provide detailed information about the {predicted_class}, including description and opening times."
        )
        return response.text
    except Exception as e:
        return f"An error occurred: {e}"

# Streamlit app
st.title("Monument Image Classifier")

# Upload image
uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "png", "jpeg"])

if uploaded_file is not None:
    # Display the uploaded image
    img = Image.open(uploaded_file)
    st.image(img, caption="Uploaded Image", use_column_width=True)

    # Preprocess the image for prediction
    img = img.resize((224, 224))  # Resize image to match model input size
    img = np.array(img)  # Convert to numpy array
    img = img / 255.0  # Normalize the image
    img = np.expand_dims(img, axis=0)  # Add a batch dimension

    # Predict the label
    label = model.predict(img)

    # Determine the predicted class
    predicted_class_index = np.argmax(label)
    predicted_class = class_names[predicted_class_index]

    # Display predicted class
    st.subheader(f"Predicted Class: {predicted_class}")

    # Fetch and display detailed information from the Gemini API
    class_details = get_class_details(predicted_class)
    st.text_area("Detailed Information:", class_details, height=300)

    # Display image with predicted label
    fig, ax = plt.subplots()
    ax.imshow(img[0])
    ax.set_title(predicted_class)
    ax.axis('off')
    st.pyplot(fig)
