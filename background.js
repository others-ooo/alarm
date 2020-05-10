// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
let alarmSet = new Set();

function setReminder(when, tip) {
	chrome.alarms.create("abcd", {when, periodInMinutes: 60 * 24});
	chrome.alarms.onAlarm.addListener(alarm => {
		if (alarm.name !== "abcd") {
			return;
		}
		if (alarmSet.has(alarm.scheduledTime)) {
			return;
		}

		chrome.notifications.create(
			{
				type: "basic",
				iconUrl: "images/get_started16.png",
				title: "健康打卡",
				message: tip,
				requireInteraction: true
			}
		);

		alarmSet.clear();
		alarmSet.add(alarm.scheduledTime);
	});
}

chrome.runtime.onInstalled.addListener(function (reason) {
	const s = new Date();
	s.setDate(s.getDate() + 1);
	s.setHours(11, 0, 0);
	setReminder(s.getTime(), "打卡！");
});

chrome.runtime.on