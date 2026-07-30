(() => {
  const sectionIds = ['planner','spots','journal','library','rigging','confidence'];
  document.querySelectorAll('.tab').forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.tab;
      document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab === button));
      sectionIds.forEach(id => {
        const section = document.getElementById(id);
        if (section) section.classList.toggle('hidden', id !== target);
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();