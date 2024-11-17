import streamlit as st
import matplotlib.pyplot as plt
from keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import google.generativeai as genai

# Configure the API client
GOOGLE_API_KEY = "AIzaSyDeOU6vNwAo3HflrO6ETjXvApqI2VK9-6Q"
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

# Streamlit App
st.title('Monument Classifier')

# Upload image
uploaded_image = st.file_uploader("Choose an image...", type=["jpg", "png", "jpeg"])

if uploaded_image is not None:
    # Load and display the uploaded image
    img = image.load_img(uploaded_image, target_size=(224, 224))
    st.image(img, caption='Uploaded Image', use_column_width=True)
    
    # Preprocess the image
    img = image.img_to_array(img)  # Convert the image to a NumPy array
    img = img / 255.0  # Normalize the image
    img = np.expand_dims(img, axis=0)  # Add a batch dimension

    # Predict the label
    label = model.predict(img)

    # Determine the predicted class
    predicted_class_index = np.argmax(label)
    predicted_class = class_names[predicted_class_index]

    # Display the predicted class
    st.subheader(f"Predicted Class: {predicted_class}")

    # Fetch detailed information from the Gemini API
    class_details = get_class_details(predicted_class)

    # Display the detailed information
    st.subheader("Detailed Information:")
    st.write(class_details)

    # Optional: Display the image with the predicted label using matplotlib
    fig, ax = plt.subplots()
    ax.imshow(img[0])
    ax.set_title(predicted_class)
    ax.axis('off')
    st.pyplot(fig)
