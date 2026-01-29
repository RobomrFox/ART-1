// @input SceneObject movingObject {"label": "The Dragon Ball"}
// @input SceneObject startPoint {"label": "Start Position"}
// @input SceneObject endPoint {"label": "Target (Mouth)"}
// @input SceneObject controlPoint {"label": "Curve Control"}
// @input float duration = 2.0

var startTime = null;
var isMoving = false;

// This function runs every frame once the animation starts
function onUpdate(eventData) {
    if (!isMoving) return;

    var timePassed = getTime() - startTime;
    var t = timePassed / script.duration;

    // If animation is finished
    if (t >= 1) {
        t = 1;
        isMoving = false;
        // Snap to exact end position to be safe
        script.movingObject.getTransform().setWorldPosition(script.endPoint.getTransform().getWorldPosition());
        return; 
    }

    // --- THE MATH MAGIC (Quadratic Bezier) ---
    // Formula: (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
    
    var p0 = script.startPoint.getTransform().getWorldPosition();   // Start
    var p1 = script.controlPoint.getTransform().getWorldPosition(); // The Magnet
    var p2 = script.endPoint.getTransform().getWorldPosition();     // End

    var term1 = p0.uniformScale((1 - t) * (1 - t));
    var term2 = p1.uniformScale(2 * (1 - t) * t);
    var term3 = p2.uniformScale(t * t);

    var finalPos = term1.add(term2).add(term3);

    script.movingObject.getTransform().setWorldPosition(finalPos);
}

// Connect the Update Event
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

// --- PUBLIC FUNCTION TO START THE MOVE ---
script.api.startMove = function() {
    print("Dragon Ball Launched!");
    // Set the object to the start position instantly
    script.movingObject.getTransform().setWorldPosition(script.startPoint.getTransform().getWorldPosition());
    script.movingObject.enabled = true; // Make sure it's visible
    startTime = getTime();
    isMoving = true;
}