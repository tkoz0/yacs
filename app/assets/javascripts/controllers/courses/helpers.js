Handlebars.registerHelper('department_code', function (id) {
  return new Handlebars.SafeString(Yacs.models.departments.store.id[id].code);
});

Handlebars.registerHelper('course_credits', function (c) {
  var outString = '';
  // render "credit(s)" properly
  if (c.min_credits != c.max_credits) {
    outString = c.min_credits + '-' + c.max_credits + ' credits';
  }
  else {
    outString = c.max_credits + ' credit' + (c.max_credits == 1 ? '' : 's');
  }
  return new Handlebars.SafeString(outString);
});

Handlebars.registerHelper('join', function (arr) {
  return new Handlebars.SafeString(arr.join(', '));
});

Handlebars.registerHelper('seats_available', function (s) {
  var remaining = s.seats - s.seats_taken;
  return new Handlebars.SafeString(remaining);
});

Handlebars.registerHelper('closed_status', function (s) {
  return new Handlebars.SafeString(s.seats > 0 && s.seats_taken >= s.seats ? 'closed' : '');
});

/* Determine whether a section's conflicts list contains any section ids in common with
 * currently selections. Set some variables on this (the current section object)
 * for subsequent Handlebars calls to use.
 * The advantage of this method is that the expensive comparison of section
 * conflicts and selected section ids is only performed once per section.
 */
Handlebars.registerHelper('evaluateConflict', function(block) {
  // Populate the conflicts cache here, with whatever data is available
  // If something already exists in the conflicts cache, don't update - it most likely is unchanged
  if(! (this.id in Yacs.cache.conflicts)) {
    Yacs.cache.conflicts[this.id] = this.conflicts;
  }

  hasConflict = false; //TODO actually involve this.conflicts

  if(hasConflict) {
    this.conflictClass = 'conflicts';
    this.hasConflict = true;
  }
  else {
    this.conflictClass = '';
    this.hasConflict = false;
  }
  return block.fn(this);
});

Handlebars.registerHelper('day_name', function (n) {
  return new Handlebars.SafeString(['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][n]);
});

Handlebars.registerHelper('time_range', function (start, end) {
  return new Handlebars.SafeString([start, end].map(function (time) {
    var hour = Math.floor(time / 100);
    var ampm = hour > 12 ? 'p' : 'a';
    hour = hour > 12 ? hour - 12 : hour == 0 ? 12 : hour;
    var minutes = time % 100;
    minutes = minutes > 9 ? minutes : minutes == 0 ? '' : '0' + minutes;
    return hour + (minutes ? ':' + minutes : '') + ampm;
  }).join('-'));
});
