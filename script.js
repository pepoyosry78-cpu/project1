const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
  });
}

const bookingForm = document.querySelector("#booking-form");

if (bookingForm) {
  const typeInput = document.querySelector("#booking-type");
  const travelersInput = document.querySelector("#travelers");
  const nightsInput = document.querySelector("#nights");
  const destinationInput = document.querySelector("#destination");
  const roomTypeInput = document.querySelector("#room-type");
  const roomsInput = document.querySelector("#rooms");
  const nightsField = document.querySelector("#nights-field");
  const roomField = document.querySelector("#room-field");
  const roomsField = document.querySelector("#rooms-field");
  const summaryType = document.querySelector("#summary-type");
  const summaryTravelers = document.querySelector("#summary-travelers");
  const summaryNights = document.querySelector("#summary-nights");
  const summaryNightsRow = document.querySelector("#summary-nights-row");
  const summaryRooms = document.querySelector("#summary-rooms");
  const summaryRoomsRow = document.querySelector("#summary-rooms-row");
  const estimatedPrice = document.querySelector("#estimated-price");
  const formMessage = document.querySelector("#form-message");
  const priceByDestination = {
    "القاهرة": 2800,
    "الأقصر وأسوان": 6800,
    "شرم الشيخ": 7400,
    "دهب": 6200,
    "الإسكندرية": 3900,
    "تاج محل - الهند": 18900,
    "الصين": 24500
  };
  const roomPrice = { standard: 2400, deluxe: 3800, suite: 5600 };
  let bookingType = "trip";

  const formatArabicNumber = (value) => new Intl.NumberFormat("ar-EG").format(value);

  const updateSummary = () => {
    const travelers = Number(travelersInput.value);
    const nights = Number(nightsInput.value);
    const rooms = Number(roomsInput.value);
    const isHotel = bookingType === "hotel";
    const price = isHotel
      ? roomPrice[roomTypeInput.value] * nights * rooms
      : (priceByDestination[destinationInput.value] || 4500);
    const total = isHotel ? price : price * travelers;
    summaryType.textContent = isHotel ? "إقامة فندقية" : "رحلة سياحية";
    summaryTravelers.textContent = travelers === 1 ? "فرد واحد" : travelers === 2 ? "فردان" : `${formatArabicNumber(travelers)} أفراد`;
    summaryNights.textContent = nights === 1 ? "ليلة واحدة" : nights === 2 ? "ليلتان" : `${formatArabicNumber(nights)} ليالي`;
    summaryNightsRow.hidden = !isHotel;
    summaryRooms.textContent = rooms === 1 ? "غرفة واحدة" : rooms === 2 ? "غرفتان" : `${formatArabicNumber(rooms)} غرف`;
    summaryRoomsRow.hidden = !isHotel;
    estimatedPrice.innerHTML = `${formatArabicNumber(total)} <small>ج.م</small>`;
  };

  document.querySelectorAll(".booking-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      bookingType = tab.dataset.bookingType;
      typeInput.value = bookingType;
      document.querySelectorAll(".booking-tab").forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });
      nightsField.hidden = bookingType !== "hotel";
      roomField.hidden = bookingType !== "hotel";
      roomsField.hidden = bookingType !== "hotel";
      formMessage.textContent = "";
      updateSummary();
    });
  });

  [travelersInput, nightsInput, destinationInput, roomTypeInput, roomsInput].forEach((input) => {
    input.addEventListener("change", updateSummary);
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("type") === "hotel") {
    document.querySelector('[data-booking-type="hotel"]').click();
  }
  if (params.has("destination")) {
    const requestedDestination = params.get("destination");
    if ([...destinationInput.options].some((option) => option.value === requestedDestination)) {
      destinationInput.value = requestedDestination;
    }
  }
  updateSummary();

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const name = new FormData(bookingForm).get("name").trim();
    formMessage.textContent = `شكراً يا ${name}! تم تجهيز طلبك. دي نسخة تجريبية؛ الطلب مش هيتبعت فعلياً إلا بعد ربط الموقع بنظام الحجز.`;
    bookingForm.reset();
    bookingType = "trip";
    typeInput.value = "trip";
    document.querySelectorAll(".booking-tab").forEach((tab) => {
      const isTrip = tab.dataset.bookingType === "trip";
      tab.classList.toggle("active", isTrip);
      tab.setAttribute("aria-selected", String(isTrip));
    });
    nightsField.hidden = true;
    roomField.hidden = true;
    roomsField.hidden = true;
    updateSummary();
  });
}
