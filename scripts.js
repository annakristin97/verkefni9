const API_URL = 'https://apis.is/company?name=';

const program = (() => {
  let input;
  let results;

  function empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function el(name, ...children) {
    const element = document.createElement(name);

    for (let child of children) {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child) {
        element.appendChild(child);
      }
    }
    return element;
  }

  function displayMessage(msg) {
    empty(results);
    results.appendChild(el('p', msg));
  }

  function displayResults(itemList) {
    if (itemList.length === 0) {
      displayMessage('Ekkert fyrirtæki fannst fyrir leitarstreng');
      return;
    }

    empty(results);

    for (const child of Array.from(itemList)) {

      const result = el(
        'dl',
        el('dt', 'Lén'),
        el('dd', child.name),
        el('dt', 'Kennitala'),
        el('dd', child.sn),
        child.active ? el('dt', 'Heimilisfang') : null,
        child.active ? el('dd', child.address) : null,
      );

      if (child.active === 1) {
        result.setAttribute('class', 'company company--active');
      } else {
        result.setAttribute('class', 'company company--inactive');
      }

      results.appendChild(result);
    }

  }

  function displayLoading() {
    empty(results);

    const img = document.createElement('img');
    img.setAttribute('alt', '');
    img.setAttribute('src', 'loading.gif');

    const loading = el('div', img, 'Leita að fyrirtækjum');
    loading.classList.add('loading');

    results.appendChild(loading);
  }

  function getResults(name) {
    displayLoading();

    fetch(`${API_URL}${name}`)
      .then((result) => {
        if (!result.ok) {
          throw new Error('non 200 status');
        }
        return result.json();
      })
      .then(data => displayResults(data.results))
      .catch((error) => {
        console.error('Villa við að sækja gögn', error);
        displayMessage('Villa við að sækja gögn');
      });
  }

  function onSubmit(e) {
    e.preventDefault();

    const name = input.value;

    if (typeof name !== 'string' || name === '') {
      displayMessage('Fyrirtæki verður að vera strengur');
    } else {
      getResults(name);
    }
  }

  function init(companies) {
    const form = companies.querySelector('form');
    input = form.querySelector('input');
    results = companies.querySelector('.results');

    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('.companies');
  program.init(companies);
});
