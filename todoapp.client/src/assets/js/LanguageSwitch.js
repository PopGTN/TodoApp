(() => {
  'use strict';

  // Function to set the selected language
  const setLanguage = language => {
    // Logic to switch language using Transloco
    // For example:
    // translocoService.setActiveLang(language);
  };

  // Function to display the active language in the dropdown
  const showActiveLanguage = language => {
    const languageSwitcher = document.querySelector('#language-switcher');
    if (!languageSwitcher) return;

    const activeLanguageIcon = document.querySelector('.language-icon-active use');
    const selectedLanguageButton = document.querySelector(`[data-language-value="${language}"]`);
    const svgOfSelectedButton = selectedLanguageButton.querySelector('svg use').getAttribute('href');

    // Update active language icon
    activeLanguageIcon.setAttribute('href', svgOfSelectedButton);

    // Optionally, you can update the aria-label or any other text if needed

    // Set focus to the language switcher (optional)
    languageSwitcher.focus();
  };

  // Event listener for language selection
  document.querySelectorAll('[data-language-value]').forEach(button => {
    button.addEventListener('click', () => {
      const language = button.getAttribute('data-language-value');
      setLanguage(language);
      showActiveLanguage(language);
    });
  });

  // Call showActiveLanguage to initialize the dropdown with the correct active language
  // Pass the current active language as an argument
  // showActiveLanguage(currentLanguage);
})();
