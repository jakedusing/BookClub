document.addEventListener("DOMContentLoaded", () => {
  const successAlert = document.getElementById("successAlert");

  if (successAlert) {
    // Automatically dismiss the alert after 1 second
    setTimeout(() => {
      const alertInstance = bootstrap.Alert.getInstance(successAlert);
      if (alertInstance) {
        alertInstance.close();
      } else {
        new bootstrap.Alert(successAlert).close();
      }
    }, 1500); // 1500 milliseconds = 1.5 second
  }
});
