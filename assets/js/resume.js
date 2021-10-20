const ANIMATION_DURATION = 600;
let _ = window._;
var highlightedSkills = [];

var timelineHoverData = {
  title: "",
  subtitle: "",
  duration: "",
  location: "",
  skills: "",
};

/**
 * Clear the filters and then also scroll to the given position.
 */
function clearFiltersAndScroll(id) {
  clearFilters();

  doScroll(id);
}

/**
 * Scroll to one of the experiences/projects/etc. in the CV.
 */
function doScroll(id) {
  const pos = $("#" + id).offset().top - 80; // take into account the fixed header
  $("html, body").animate(
    {
      scrollTop: pos,
    },
    1000
  );
}

/**
 * Set the data for the thing that is being hovered over so it can be displayed in the timeline hover div.
 */
function setTimelineHoverData(name, subtitle, duration, location, skills) {
  var skillSpans = "";
  if (skills) {
    JSON.parse(skills).forEach(
      (skill) =>
        (skillSpans +=
          "<span class='timeline-hover-skill'>" + skill + "</span>")
    );
  }
  timelineHoverData.name = name;
  timelineHoverData.subtitle = subtitle;
  timelineHoverData.duration = duration;
  timelineHoverData.location = location;
  timelineHoverData.skills = skillSpans;
}

/**
 * Clear all the highlighted skills.
 */
function clearFilters() {
  if (highlightedSkills && highlightedSkills.length > 0) {
    [...highlightedSkills].forEach((skill) => {
      highlightSkill(skill);
    });
  }
}

/**
 * Highlight a skill as it is inline next to an experience or on the skills bar.
 */
function highlightSkill(skill, scrollTo) {
  if (highlightedSkills.includes(skill)) {
    $(".skill." + skill).removeClass("skill-selected");
    $(".experience-skill." + skill).removeClass("skill-selected");
    $(".profile-top-skill." + skill).removeClass("skill-selected");

    _.remove(highlightedSkills, function (s) {
      return s == skill;
    });
  } else {
    $(".skill." + skill).addClass("skill-selected");
    $(".experience-skill." + skill).addClass("skill-selected");
    $(".profile-top-skill." + skill).addClass("skill-selected");
    highlightedSkills.push(skill);
  }

  filterSkills();

  if (scrollTo) {
    doScroll(scrollTo);
  }
}

/**
 * Filter skills (using an OR and not an AND).
 */
function filterSkills() {
  /*
   * If there are skills highlighted, don't animate on the show and then also on the hide.  The effect ends up
   * looking bad.  Instead, just do the hide.
   */
  if (highlightedSkills.length > 0) {
    $(".experience-container").show();
    $(".experience-accomplishment").show();
    $(".experience-project").show();
    highlightedSkills.forEach(function (skill) {
      var skillClass = "." + skill;
      $(".experience-container").not(skillClass).hide(ANIMATION_DURATION);
      $(".experience-accomplishment").not(skillClass).hide(ANIMATION_DURATION);
      $(".experience-project").not(skillClass).hide(ANIMATION_DURATION);
    });
  } else {
    /*
     * If there are no highlighted skills, then we're only unfiltering/showing all, so do the animation here.
     */
    $(".experience-container").show(ANIMATION_DURATION);
    $(".experience-accomplishment").show(ANIMATION_DURATION);
    $(".experience-project").show(ANIMATION_DURATION);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

$(document).ready(function () {
  /**
   * Hide the timeline bar
   */
  $(".timeline-bar").mouseleave(function (e) {
    $(".timeline-hover").hide();
  });

  /**
   * Show and place the hover over a timeline bar
   */
  $(".timeline-bar").mousemove(function (e) {
    let sOff = getScrollOffsets(); // if scrolled down, the height of what can't be seen above
    let top = e.clientY + sOff.y - 210;
    let left = e.clientX + sOff.x + 20;
    let bottom = window.innerHeight - e.clientY - sOff.y + 15; // bottom counts from bottom up, so subtract from
    // viewport height

    // Handle case where the hover would go off the right edge of the screen
    if (window.innerWidth < left + 350) {
      left = window.innerWidth - 400;
    }

    // Handle case where the hover would go above the top of the screen (if scrolled)
    if (top < sOff.y) {
      bottom = window.innerHeight - sOff.y - 200;
    }

    $(".timeline-hover").show();
    $(".timeline-hover").css("left", left);
    $(".timeline-hover").css("bottom", bottom);
    $(".timeline-hover-name").text(timelineHoverData.name);
    $(".timeline-hover-subtitle").text(timelineHoverData.subtitle || "");
    $(".timeline-hover-duration").text(timelineHoverData.duration || "");
    $(".timeline-hover-location").text(timelineHoverData.location || "");
    $(".timeline-hover-skills").html(timelineHoverData.skills || "");
  });
});
