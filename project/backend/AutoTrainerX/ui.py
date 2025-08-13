import streamlit as st
import requests
import time

st.set_page_config(page_title="GPT Fine-Tuning Tool", page_icon="🤖", layout="wide")

st.title("📄 AI Fine-Tuning & File Processing")

st.sidebar.header("⚙️ Settings")
st.sidebar.text("Dark Mode Enabled 🌙")

# Upload Files
uploaded_files = st.file_uploader("📤 Upload Files", accept_multiple_files=True, type=["pdf", "txt", "csv"])

if uploaded_files:
    st.write("📂 **Processing Files...**")
    with st.spinner("Uploading files..."):
        # Prepare files for FastAPI (multiple files with the same key)
        files_to_upload = [("files", (file.name, file.getvalue())) for file in uploaded_files]
        response = requests.post("http://localhost:8000/upload/", files=files_to_upload)

        if response.status_code == 200:
            st.success("✅ All files processed successfully!")
        else:
            st.error(f"❌ Failed to upload files: {response.json().get('detail', 'Unknown error')}")

# Display Uploaded Files
st.subheader("📊 Uploaded File History")

try:
    uploaded_history = requests.get("http://localhost:8000/files").json()

    if isinstance(uploaded_history, list) and uploaded_history:
        for file in uploaded_history:
            if isinstance(file, dict) and 'filename' in file:
                st.write(f"📄 {file['filename']} ({file.get('size', 0)} bytes)")
            else:
                st.warning("⚠️ Invalid file format received from server.")
    else:
        st.info("ℹ️ No uploaded files found.")
except Exception as e:
    st.error(f"❌ Failed to fetch uploaded file history: {e}")

# Query AI Model
st.subheader("💬 Query Fine-Tuned Model")
query_input = st.text_input("🔍 Ask the AI Model:")

if st.button("🧠 Query AI"):
    if query_input.strip():
        with st.spinner("Thinking... 🤔"):
            try:
                response = requests.post("http://localhost:8000/query/", json={"prompt": query_input})
                if response.status_code == 200:
                    st.success("✅ AI Response:")
                    st.write(response.json().get("response", "No response received."))
                else:
                    st.error("❌ Error querying model.")
            except Exception as e:
                st.error(f"❌ Failed to connect to AI query endpoint: {e}")
    else:
        st.warning("⚠️ Please enter a query.")
