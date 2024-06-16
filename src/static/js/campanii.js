document.getElementById('logout').addEventListener('click', function(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/';
});

const campaignDetails = {
    1: {
        title: "CUM SĂ CREŞTEM SĂNĂTOŞI",
        description: "Proiectul ,,Cum să creştem sănătoşi” cuprinde şapte activităţi concepute în concordanţă cu nivelul de dezvoltare socio-emoţională al copiilor de vârstă preşcolară şi şcolară mică, astfel încât să fie atractive şi uşor de înţeles. Copiii vor învăţa, prin joc, şi activităţi practice (desenat, decupat, scenete etc.), care sunt comportamentele ce îi vor ajuta să se dezvolte sănătos şi cum să se ferească de pericole."
    },
    2: {
        title: "ABC-UL EMOŢIILOR",
        description: "Proiectul se adresează copiilor din clasele I şi a II-a şi se centrează pe cinci teme principale: autocunoaştere/valorizare personală, exersarea modalităţilor adecvate de gestionare a emoţiilor neplăcute, abilităţi de comunicare asertivă şi de a face faţă presiunii grupului, adoptarea deciziilor corecte pentru o dezvoltare sănătoasă, importanţa relaţiilor interpersonale."
    },
    3: {
        title: "NECENZURAT",
        description: "„Necenzurat” are o componentă pentru elevi şi una pentru părinţi. Componenta pentru elevi constă în parcurgerea a 12 lecţii, săptămânal, care urmăresc îmbunătăţirea cunoştinţelor legate de factorii de risc şi de protecţie, concomitent cu construirea atitudinilor împotriva consumului, concentrarea asupra abilităţilor, credinţelor şi normelor interpersonale şi asupra informaţiilor realiste despre consumul de droguri, precum şi dezvoltarea abilităţilor intrapersonale, cum ar fi cele de coping, de rezolvare a problemelor, de  luare a deciziilor şi de stabilire a obiectivelor."
    },
    4: {
        title: "FRED GOES NET",
        description: "Proiectul se adresează tuturor elevilor de liceu (prevenire universală), care doresc să participe la Cursul FRED, în condiţiile în care se pot face aranjamentele pentru constituirea unui grup de maxim 13 elevi, dar, cu precădere, liceenilor care au semne minime, dar detectabile de consum de droguri, dar nu îndeplinesc criteriile de diagnostic specifice abuzului sau dependenţei (prevenire indicată) şi liceenilor care sunt la limita riscului de a deveni dependenţi (prevenire selectivă – ex. elevi cu părinţi dependenţi de droguri, elevi din familii cu statut socio-economic scăzut, elevi cu risc de abandon şcolar, elevi cu comportament deviant, elevi cu părinţi dependenţi, copii de imigranţi etc.)."
    },
    5: {
        title: "MESAJUL MEU ANTIDROG",
        description: "Obiectivul general al proiectului îl reprezintă dezvoltarea unor atitudini şi practici de viaţă sănătoasă pentru un număr estimat de 6000 de elevi de gimnaziu şi liceu, prin implicarea în activităţi culturale, artistice, sportive etc., ca alternativă la consumul de droguri. Concursul, care va fi implementat la nivel naţional, în anul şcolar 2021-2022, va avea tema: „MESAJUL MEU ANTIDROG” şi se va desfăşura pe următoarele secţiuni:film de scurt metraj şi spot video, arte vizuale– grafică, pictură şi fotografie, eseu, sport"
    },
    6: {
        title: "EU ŞI COPILUL MEU",
        description: "În cadrul proiectului ,,EU ŞI COPILUL MEU”, părinţii participă la şedinţe de informare, educare şi conştientizare cu privire la efectele consumului de droguri, iar consilierii şcolari, psihologii, asistenţii sociali şi cadrele didactice titulare, care îşi desfăşoară activitatea în unităţi şcolare cu clasele V-VIII sau în Centrele Judeţene de Resurse şi Asistenţă Educaţională, atât din mediul urban, cât şi din mediul rural, sunt formaţi de specialiştii ANA, în vederea dezvoltării unei resurse de specialitate pentru implementarea proiectului.EU ŞI COPILUL MEU” conţine nouă activităţi interactive cu părinţii, incluzând şi aplicaţii cu caracter ludic: Să facem cunoştinţă, Nevoile copilului meu, Ce fel de părinte sunt?, Cum comunicăm eficient cu copiii, Cum controlăm conflictele din familie, Cum stabilim reguli şi pedepse, Cum supraveghem anturajul copilului,  Cum afectează familia consumul de tutun, alcool şi droguri şi Gala de absolvire."
    }
};

const campaignCards = document.querySelectorAll('.campaign-card');
const modal = document.getElementById('campaign-modal');
const modalContent = document.querySelector('.modal-content');
const modalTitle = modalContent.querySelector('.modal-title');
const modalDescription = modalContent.querySelector('.modal-description');
const closeButton = modalContent.querySelector('.close-button');

campaignCards.forEach(card => {
    card.querySelector('.read-more').addEventListener('click', () => {
        const id = card.dataset.id;
        const { title, description } = campaignDetails[id];

        modalTitle.innerText = title;
        modalDescription.innerText = description;

        modal.style.display = 'flex';
    });
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
