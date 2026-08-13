const allowTypes = ['image/jpeg', 'image/png'];
const elem = document.querySelector("input[type=file]");

elem.addEventListener("change", ev => {
    const file = ev.target.files[0];

    if (!allowTypes.includes(file.type)) {
        return;
    }

    const reader = new FileReader();

    reader.onload = ev => {
        const base64 = ev.target.result;

        const img = document.createElement("img");
        img.width = 600;
        img.src = base64;

        document.body.appendChild(img);
    }

    reader.readAsDataURL(file);
});