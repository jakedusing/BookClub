document.addEventListener("DOMContentLoaded", () => {
  const successAlert = document.getElementById("successAlert");
  const errorAlert = document.getElementById("errorAlert");

  const dismissAlert = (alertElement) => {
    if (alertElement) {
      setTimeout(() => {
        const alertInstance = bootstrap.Alert.getInstance(alertElement);
        if (alertInstance) {
          alertInstance.close();
        } else {
          new bootstrap.Alert(alertElement).close();
        }
      }, 1500);
    }
  };

  dismissAlert(successAlert);
  dismissAlert(errorAlert);
});
