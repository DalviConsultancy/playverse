document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('analogClockCanvas');
    const ctx = canvas.getContext('2d');
    const digitalTimeDisplay = document.getElementById('digitalTimeDisplay');
    const selectedTimeInput = document.getElementById('selectedTime');

    // Buttons
    const startMinus30Btn = document.getElementById('startMinus30');
    const startPlus30Btn = document.getElementById('startPlus30');
    const endMinus30Btn = document.getElementById('endMinus30');
    const endPlus30Btn = document.getElementById('endPlus30');

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10; // Clock face radius

    let startAngle = 0; // Angle for the first hand (e.g., start time)
    let endAngle = 30;  // Angle for the second hand (e.g., end time)

    const ANGLE_INCREMENT = 15; // 30 minutes = 15 degrees (360 degrees / 12 hours = 30 degrees/hour; 30/2 = 15)

    function drawClock() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw clock face
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.05)';
        ctx.fill();
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw hour marks and numbers
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180; // Convert hour to radians, adjust for 12 o'clock at top
            const x = centerX + radius * 0.85 * Math.cos(angle);
            const y = centerY + radius * 0.85 * Math.sin(angle);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 20px Orbitron';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(i.toString(), x, y);
        }

        // Draw minute marks
        for (let i = 0; i < 60; i++) {
            if (i % 5 !== 0) { // Don't draw over hour marks
                const angle = (i * 6 - 90) * Math.PI / 180; // 6 degrees per minute
                const x1 = centerX + radius * 0.95 * Math.cos(angle);
                const y1 = centerY + radius * 0.95 * Math.sin(angle);
                const x2 = centerX + radius * 0.98 * Math.cos(angle);
                const y2 = centerY + radius * 0.98 * Math.sin(angle);

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        // Draw highlight arc
        let drawStartRad = (startAngle - 90) * Math.PI / 180;
        let drawEndRad = (endAngle - 90) * Math.PI / 180;

        // Adjust for arc drawing if end is before start (e.g., 10 PM to 2 AM)
        if (endAngle < startAngle) {
            drawEndRad += 2 * Math.PI; // Add a full circle to end angle
        }

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.7, drawStartRad, drawEndRad); // Draw arc at 70% radius
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)'; // Arc color
        ctx.lineWidth = 25; // Arc thickness
        ctx.stroke();

        // Draw start hand
        drawHand(startAngle, radius * 0.6, 6, '#00f0ff'); // Slightly shorter, thicker
        // Draw end hand
        drawHand(endAngle, radius * 0.6, 6, '#8CE3FF'); // Slightly shorter, thicker, different color

        // Draw center dot
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }

    function drawHand(angle, length, width, color) {
        const rad = (angle - 90) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + length * Math.cos(rad), centerY + length * Math.sin(rad));
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    function angleToTime(angle) {
        const totalMinutes = Math.round((angle / 360) * 12 * 60);
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;

        let period = 'AM';
        if (hours >= 12) {
            period = 'PM';
            if (hours > 12) hours -= 12;
        }
        if (hours === 0) hours = 12; // 0 o'clock is 12 AM/PM

        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${period}`;
    }

    function updateDigitalTime() {
        const startTime = angleToTime(startAngle);
        const endTime = angleToTime(endAngle);
        digitalTimeDisplay.value = `${startTime} - ${endTime}`;
        selectedTimeInput.value = `${startTime} - ${endTime}`;
    }

    // Function to adjust angle
    function adjustAngle(target, direction) {
        if (target === 'start') {
            startAngle = (startAngle + direction * ANGLE_INCREMENT + 360) % 360;
        } else if (target === 'end') {
            endAngle = (endAngle + direction * ANGLE_INCREMENT + 360) % 360;
        }
        drawClock();
        updateDigitalTime();
    }

    // Attach event listeners to buttons
    startMinus30Btn.addEventListener('click', () => adjustAngle('start', -1));
    startPlus30Btn.addEventListener('click', () => adjustAngle('start', 1));
    endMinus30Btn.addEventListener('click', () => adjustAngle('end', -1));
    endPlus30Btn.addEventListener('click', () => adjustAngle('end', 1));

    // Initial draw
    drawClock();
    updateDigitalTime();
});