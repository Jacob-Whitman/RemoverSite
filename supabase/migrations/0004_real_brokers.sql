-- ============================================================
-- Migration: 0004_real_brokers.sql
-- Replaces placeholder seed data with a verified real data broker list.
-- Sources:
--   github.com/digisamroc/eraser (YAML broker database)
--   github.com/yaelwrites/big-ass-data-broker-opt-out-list (BADBOOL)
-- Verified: 2026-06-09
-- ============================================================

-- Remove all placeholder brokers
DELETE FROM public.brokers;

INSERT INTO public.brokers (
  name,
  website_url,
  opt_out_url,
  category,
  priority,
  country_region,
  source_reference,
  requires_email_verification,
  requires_phone_verification,
  requires_id_verification,
  requires_payment,
  supports_automation,
  automation_method,
  manual_instructions,
  required_fields,
  difficulty_score,
  estimated_days,
  active,
  last_verified_at
) VALUES

-- ============================================================
-- PEOPLE-SEARCH — HIGH PRIORITY
-- These sites directly expose home addresses, phone numbers,
-- relatives, and employer info — top targets for law enforcement.
-- ============================================================

(
  'Spokeo',
  'https://www.spokeo.com',
  'https://www.spokeo.com/optout',
  'people_search', 'high', 'US',
  'privacy@spokeo.com',
  true, false, false, true,
  false, 'manual',
  'Go to spokeo.com/optout. Search for your name and city. Select your record and click "Remove this listing". Enter your email to receive a confirmation link and click it. May require a $1 identity verification charge. Scroll down on the page to find the opt-out section.',
  '["first_name","last_name","city","state","email"]'::jsonb,
  3, 7, true, '2026-06-09'::timestamptz
),
(
  'BeenVerified',
  'https://www.beenverified.com',
  'https://www.beenverified.com/app/optout/search',
  'people_search', 'high', 'US',
  'privacy@beenverified.com',
  true, false, false, false,
  false, 'manual',
  'Go to beenverified.com/app/optout/search. Search by name and state, select your record, and submit the opt-out. A confirmation email will be sent — click the link to complete. Also opt out of address search at beenverified.com/app/optout/address-search. Owns PeopleLooker and PeopleSmart; one opt-out per email address.',
  '["first_name","last_name","city","state","email"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'Whitepages',
  'https://www.whitepages.com',
  'https://www.whitepages.com/suppression_requests',
  'people_search', 'high', 'US',
  'privacy@whitepages.com',
  false, true, false, true,
  false, 'manual',
  'Go to whitepages.com/suppression_requests. Search for your listing. Select it and submit a removal request. An automated phone call will deliver a 4-digit code to confirm. May charge for verification. Also submit for 411.com (same process — owned by Whitepages).',
  '["first_name","last_name","state","phone"]'::jsonb,
  4, 14, true, '2026-06-09'::timestamptz
),
(
  'Intelius',
  'https://www.intelius.com',
  'https://suppression.peopleconnect.us/login',
  'people_search', 'high', 'US',
  'privacy@intelius.com',
  true, false, false, false,
  false, 'manual',
  'Go to suppression.peopleconnect.us/login and create a free account or log in. Search for and select your listing, then submit a suppression request. Removing from Intelius also covers: Addresses.com, Anywho, Classmates, DateCheck, Instant Checkmate, InstantPeopleFinder, PeopleFinder, PeopleLookup, Spock, TruthFinder, US Search, and Zabasearch.',
  '["first_name","last_name","state"]'::jsonb,
  2, 30, true, '2026-06-09'::timestamptz
),
(
  'TruePeopleSearch',
  'https://www.truepeoplesearch.com',
  'https://www.truepeoplesearch.com/removal',
  'people_search', 'high', 'US',
  'contact@truepeoplesearch.com',
  false, false, false, false,
  false, 'manual',
  'Go to truepeoplesearch.com/removal. Find your record by searching your name and state. Click the record to open it, then click "Remove this record" at the bottom of the page. Complete the CAPTCHA to confirm. No email or phone verification required.',
  '["first_name","last_name","state"]'::jsonb,
  1, 7, true, '2026-06-09'::timestamptz
),
(
  'FastPeopleSearch',
  'https://www.fastpeoplesearch.com',
  'https://www.fastpeoplesearch.com/removal',
  'people_search', 'high', 'US',
  'privacy@fastpeoplesearch.com',
  false, false, false, false,
  false, 'manual',
  'Go to fastpeoplesearch.com/removal. Enter your name and state to find your record. Click "Remove This Record" and complete the CAPTCHA. No email verification required.',
  '["first_name","last_name","state"]'::jsonb,
  1, 7, true, '2026-06-09'::timestamptz
),
(
  'USPhoneBook',
  'https://www.usphonebook.com',
  'https://www.usphonebook.com/opt-out',
  'people_search', 'high', 'US',
  'info@usphonebook.com',
  false, false, false, false,
  false, 'manual',
  'Go to usphonebook.com/opt-out. Search for your listing by name and state. Select the record and submit the opt-out form. No email or phone verification required.',
  '["first_name","last_name","state"]'::jsonb,
  1, 7, true, '2026-06-09'::timestamptz
),
(
  'ThatsThem',
  'https://thatsthem.com',
  'https://thatsthem.com/optout',
  'people_search', 'high', 'US',
  'support@thatsthem.com',
  false, false, false, false,
  false, 'manual',
  'Go to thatsthem.com/optout. Search for your listing, select it, and submit the removal form. No verification required. Do not click any Spokeo-related links on the page — they lead to a paid product.',
  '["first_name","last_name","state"]'::jsonb,
  1, 7, true, '2026-06-09'::timestamptz
),
(
  'Instant Checkmate',
  'https://www.instantcheckmate.com',
  'https://www.instantcheckmate.com/opt-out',
  'people_search', 'high', 'US',
  'privacy@instantcheckmate.com',
  true, false, false, false,
  false, 'manual',
  'Go to instantcheckmate.com/opt-out. Search by name and state, select your record, and submit the opt-out form. A confirmation email will be sent — click the link to complete. This is a PeopleConnect (Intelius) subsidiary; removing via suppression.peopleconnect.us may also cover this.',
  '["first_name","last_name","city","state","email"]'::jsonb,
  2, 30, true, '2026-06-09'::timestamptz
),
(
  'TruthFinder',
  'https://www.truthfinder.com',
  'https://www.truthfinder.com/opt-out',
  'people_search', 'high', 'US',
  'privacy@truthfinder.com',
  true, false, false, false,
  false, 'manual',
  'Go to truthfinder.com/opt-out. Search by name and state, select your record, and submit the opt-out form. A confirmation email will be sent — click the link to complete. This is a PeopleConnect (Intelius) subsidiary; removing via suppression.peopleconnect.us may also cover this.',
  '["first_name","last_name","city","state","email"]'::jsonb,
  2, 30, true, '2026-06-09'::timestamptz
),
(
  'MyLife',
  'https://www.mylife.com',
  'https://www.mylife.com/privacyrequest',
  'people_search', 'high', 'US',
  'privacy@mylife.com',
  true, true, true, false,
  false, 'manual',
  'Go to mylife.com/privacyrequest or email privacy@mylife.com with your name and your profile page URL. May require a phone call to (888) 704-1900 or a copy of a driver''s license (with sensitive info blacked out) to verify identity. This site aggregates reputation scores and relationship data — high priority for law enforcement.',
  '["first_name","last_name","city","state"]'::jsonb,
  4, 30, true, '2026-06-09'::timestamptz
),
(
  'Nuwber',
  'https://nuwber.com',
  'https://nuwber.com/removal/link',
  'people_search', 'high', 'US',
  'support@nuwber.com',
  true, false, false, false,
  false, 'manual',
  'Go to nuwber.com. Use the "Filter by state" feature to locate your record. Copy the URL of your listing and go to nuwber.com/removal/link. Paste the URL and enter your email, then click the confirmation link sent to you. If multiple listings exist, repeat for each one.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'Radaris',
  'https://radaris.com',
  'https://radaris.com/control-privacy',
  'people_search', 'high', 'US',
  'customer-service@radaris.com',
  true, false, false, false,
  false, 'manual',
  'Go to radaris.com. Search for your name. If a "View Profile" button is visible on your record, copy the URL and submit it at radaris.com/control-privacy. If no button is visible, email a screenshot of your listing to customer-service@radaris.com with an opt-out request. May require multiple attempts.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'SmartBackgroundChecks',
  'https://www.smartbackgroundchecks.com',
  'https://www.smartbackgroundchecks.com/optout',
  'background_check', 'high', 'US',
  NULL,
  false, false, false, false,
  false, 'manual',
  'Go to smartbackgroundchecks.com/optout. Search by name and state, select your record, and submit the opt-out. Removing here also removes from PeopleFinders. No verification required.',
  '["first_name","last_name","state"]'::jsonb,
  1, 7, true, '2026-06-09'::timestamptz
),
(
  'AdvancedBackgroundChecks',
  'https://www.advancedbackgroundchecks.com',
  'https://www.advancedbackgroundchecks.com/removal',
  'background_check', 'high', 'US',
  'privacy@advancedbackgroundchecks.com',
  false, false, false, false,
  false, 'manual',
  'Go to advancedbackgroundchecks.com/removal. Enter your first and last name and state. Optional fields can be left blank. Select your record and submit the removal form. No email verification required.',
  '["first_name","last_name","state"]'::jsonb,
  1, 14, true, '2026-06-09'::timestamptz
),
(
  'CheckPeople',
  'https://checkpeople.com',
  'https://checkpeople.com/opt-out',
  'people_search', 'high', 'US',
  'operations@checkpeople.com',
  true, false, false, false,
  false, 'manual',
  'Go to checkpeople.com/opt-out. Enter your full legal name and date of birth to find your record. Submit the opt-out form and confirm via the email verification link sent to you.',
  '["first_name","last_name","year_of_birth","state"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'FamilyTreeNow',
  'https://www.familytreenow.com',
  'https://www.familytreenow.com/optout',
  'people_search', 'high', 'US',
  'privacy@familytreenow.com',
  false, false, false, false,
  false, 'manual',
  'Go to familytreenow.com/optout. Search by name and state, select your listing, and submit the removal form. No verification required.',
  '["first_name","last_name","state"]'::jsonb,
  1, 7, true, '2026-06-09'::timestamptz
),
(
  'ZabaSearch',
  'https://www.zabasearch.com',
  'https://www.zabasearch.com/block_records',
  'people_search', 'high', 'US',
  'privacy@zabasearch.com',
  false, false, false, false,
  false, 'manual',
  'Go to zabasearch.com/block_records. Enter your name and state to find and block your record. This is an Intelius subsidiary — using the PeopleConnect suppression portal may also cover this.',
  '["first_name","last_name","state"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'LexisNexis Risk Solutions',
  'https://risk.lexisnexis.com',
  'https://optout.lexisnexis.com',
  'background_check', 'high', 'US',
  'privacy.information.mgr@lexisnexis.com',
  false, false, false, false,
  false, 'manual',
  'Go to optout.lexisnexis.com. Submit a consumer opt-out request providing your name, address, and email. LexisNexis is a major B2B aggregator used by insurers, law firms, and background check companies. Processing may take up to 30 days.',
  '["first_name","last_name","state","email"]'::jsonb,
  3, 30, true, '2026-06-09'::timestamptz
),

-- ============================================================
-- PEOPLE-SEARCH — MEDIUM PRIORITY
-- ============================================================

(
  'NeighborWho',
  'https://neighborwho.com',
  'https://neighborwho.com/remove',
  'people_search', 'medium', 'US',
  'privacy@neighborwho.com',
  false, false, false, false,
  false, 'manual',
  'Go to neighborwho.com/remove. Enter your name and state to find your listing. Select your record and submit the removal request.',
  '["first_name","last_name","state"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'IDTrue',
  'https://www.idtrue.com',
  'https://www.idtrue.com/optout',
  'people_search', 'medium', 'US',
  'privacy@idtrue.com',
  false, false, false, false,
  false, 'manual',
  'Go to idtrue.com/optout. Search for your record by name and state. Select your listing and submit the opt-out form.',
  '["first_name","last_name","state"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'Pipl',
  'https://pipl.com',
  'https://pipl.com/personal-information-removal-request',
  'people_search', 'medium', 'Global',
  'privacy@pipl.com',
  false, false, false, false,
  false, 'manual',
  'Go to pipl.com/personal-information-removal-request. Fill out the removal form with your name and relevant identifying details. Pipl is a B2B data API used by investigators and HR tools — removal may take longer than consumer-facing sites.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 30, true, '2026-06-09'::timestamptz
),
(
  'Addresses.com',
  'https://www.addresses.com',
  'https://www.addresses.com/optout.php',
  'people_search', 'medium', 'US',
  'privacy@addresses.com',
  false, false, false, false,
  false, 'manual',
  'Go to addresses.com/optout.php. Search by name and state, select your record, and submit the opt-out form. This is an Intelius subsidiary — using the PeopleConnect suppression portal may also cover this.',
  '["first_name","last_name","state"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'PeopleSmart',
  'https://www.peoplesmart.com',
  'https://www.beenverified.com/app/optout/search',
  'people_search', 'medium', 'US',
  'privacy@peoplesmart.com',
  true, false, false, false,
  false, 'manual',
  'PeopleSmart is a BeenVerified subsidiary. Opt out at beenverified.com/app/optout/search. Enter your name and state, find your record, and submit. A confirmation email link is required.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'US Search',
  'https://www.ussearch.com',
  'https://suppression.peopleconnect.us/login',
  'people_search', 'medium', 'US',
  'privacy@ussearch.com',
  true, false, false, false,
  false, 'manual',
  'US Search is an Intelius/PeopleConnect subsidiary. Opt out via suppression.peopleconnect.us/login. Create a free account, find your record, and submit the suppression request.',
  '["first_name","last_name","state"]'::jsonb,
  2, 30, true, '2026-06-09'::timestamptz
),
(
  'Centeda',
  'https://centeda.com',
  'https://centeda.com/ng/control/privacy',
  'people_search', 'medium', 'US',
  'support@centeda.com',
  false, false, false, false,
  false, 'manual',
  'Go to centeda.com/ng/control/privacy. Search for your record and submit the privacy control request.',
  '["first_name","last_name","state"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'Cyber Background Checks',
  'https://www.cyberbackgroundchecks.com',
  'https://www.cyberbackgroundchecks.com/removal',
  'background_check', 'medium', 'US',
  NULL,
  false, false, false, false,
  false, 'manual',
  'Go to cyberbackgroundchecks.com/removal. Enter your name and state to search for your listing. Select the record and submit the removal form.',
  '["first_name","last_name","state"]'::jsonb,
  1, 14, true, '2026-06-09'::timestamptz
),
(
  'InfoTracer',
  'https://infotracer.com',
  'https://infotracer.com/optout/',
  'people_search', 'medium', 'US',
  NULL,
  false, false, false, false,
  false, 'manual',
  'Go to infotracer.com/optout/. Enter your name and state. Select your record and submit the opt-out form. Mail and fax removal options are also available.',
  '["first_name","last_name","state"]'::jsonb,
  1, 14, true, '2026-06-09'::timestamptz
),
(
  'National Public Data',
  'https://nationalpublicdata.com',
  'https://nationalpublicdata.com/optout.html',
  'public_records', 'medium', 'US',
  NULL,
  true, false, false, false,
  false, 'manual',
  'Go to nationalpublicdata.com. Search for your name to locate your listing and copy the page URL. Go to nationalpublicdata.com/optout.html, paste your record URL, enter your email, and submit. Click the confirmation link sent to you.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'PeopleByName',
  'https://www.peoplebyname.com',
  'https://www.peoplebyname.com/remove.php',
  'people_search', 'medium', 'US',
  NULL,
  false, false, false, false,
  false, 'manual',
  'Go to peoplebyname.com/remove.php. Opt out each individual record separately. No email verification required.',
  '["first_name","last_name","state"]'::jsonb,
  1, 14, true, '2026-06-09'::timestamptz
),
(
  'PeopleSearchNow',
  'https://www.peoplesearchnow.com',
  'https://www.peoplesearchnow.com/opt-out',
  'people_search', 'medium', 'US',
  NULL,
  false, false, false, false,
  false, 'manual',
  'Go to peoplesearchnow.com/opt-out. Enter your name and state to locate your record. Submit the opt-out form.',
  '["first_name","last_name","state"]'::jsonb,
  1, 14, true, '2026-06-09'::timestamptz
),
(
  'Private Records',
  'https://privaterecords.net',
  'https://privaterecords.net/api/helper/optOutLight/search',
  'public_records', 'medium', 'US',
  NULL,
  false, false, false, false,
  false, 'manual',
  'Go to privaterecords.net/api/helper/optOutLight/search. Search by name and state to find your record. Submit the opt-out form.',
  '["first_name","last_name","state"]'::jsonb,
  1, 14, true, '2026-06-09'::timestamptz
),
(
  'Rehold',
  'https://rehold.com',
  'https://rehold.com',
  'people_search', 'medium', 'US',
  NULL,
  false, false, false, false,
  false, 'manual',
  'Go to rehold.com. Search for your address or name to locate your listing. On your record page, click the red "Remove" button and complete the CAPTCHA.',
  '["first_name","last_name","state"]'::jsonb,
  1, 14, true, '2026-06-09'::timestamptz
),
(
  'SearchQuarry',
  'https://www.searchquarry.com',
  'https://members.searchquarry.com/removeMyData/',
  'people_search', 'medium', 'US',
  NULL,
  true, false, false, false,
  false, 'manual',
  'Go to members.searchquarry.com/removeMyData/. Enter your name and state to search. Select your record and submit the removal request. A verification link will be sent to your email — click it to complete.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'Social Catfish',
  'https://socialcatfish.com',
  'https://socialcatfish.com/opt-out/',
  'people_search', 'medium', 'US',
  NULL,
  true, false, false, false,
  false, 'manual',
  'Go to socialcatfish.com/opt-out/. Search for your record and note the URLs of your listings. Select the removal type and submit. A confirmation email will be sent — click the link to finalize removal.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'UnMask',
  'https://unmask.com',
  'https://unmask.com/opt-out/',
  'people_search', 'medium', 'US',
  NULL,
  true, false, false, false,
  false, 'manual',
  'Go to unmask.com/opt-out/. Search for your record by name and state. Select your listing and submit the opt-out form. Complete the CAPTCHA and verify via the email confirmation link.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'USA People Search',
  'https://usa-people-search.com',
  'https://usa-people-search.com/removal',
  'people_search', 'medium', 'US',
  NULL,
  false, false, false, false,
  false, 'manual',
  'Go to usa-people-search.com/removal. Search for and select your listing, then submit the removal form.',
  '["first_name","last_name","state"]'::jsonb,
  1, 14, true, '2026-06-09'::timestamptz
),
(
  'Veripages',
  'https://veripages.com',
  'https://veripages.com/inner/control-privacy',
  'people_search', 'medium', 'US',
  NULL,
  true, false, false, false,
  false, 'manual',
  'Go to veripages.com/inner/control-privacy. Search for your record by name and state. Complete the CAPTCHA and submit. A confirmation email will be sent — click the link to finalize.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'VoterRecords',
  'https://voterrecords.com',
  'https://voterrecords.com',
  'public_records', 'medium', 'US',
  NULL,
  true, false, false, false,
  false, 'manual',
  'Go to voterrecords.com. Find your record by searching your name and state. On your profile page, click the opt-out link. Confirm via the email verification link.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'NeighborReport',
  'https://neighbor.report',
  'https://neighbor.report/remove',
  'people_search', 'medium', 'US',
  NULL,
  true, false, false, false,
  false, 'manual',
  'Go to neighbor.report/remove. Search for your record and submit the removal request. Email verification is required.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'PropertyRecs',
  'https://propertyrecs.com',
  'https://dashboard.propertyrecs.com/opt-out',
  'public_records', 'medium', 'US',
  NULL,
  false, false, false, false,
  false, 'manual',
  'Go to dashboard.propertyrecs.com/opt-out. Search by name and state to locate your record. Submit the opt-out request.',
  '["first_name","last_name","state"]'::jsonb,
  1, 14, true, '2026-06-09'::timestamptz
),
(
  '411.com',
  'https://www.411.com',
  'https://www.whitepages.com/suppression_requests',
  'people_search', 'medium', 'US',
  NULL,
  false, true, false, true,
  false, 'manual',
  '411.com is owned by Whitepages. Use the Whitepages suppression process: go to whitepages.com/suppression_requests, find your listing, and submit. An automated phone call will deliver a 4-digit verification code.',
  '["first_name","last_name","state","phone"]'::jsonb,
  4, 14, true, '2026-06-09'::timestamptz
),
(
  'ClustrMaps',
  'https://clustrmaps.com',
  'https://clustrmaps.com/bl/opt-out',
  'people_search', 'medium', 'US',
  NULL,
  false, false, false, false,
  false, 'manual',
  'Go to clustrmaps.com/bl/opt-out. Check off all items associated with your address or account and submit the opt-out request. No verification required.',
  '["first_name","last_name","state"]'::jsonb,
  1, 14, true, '2026-06-09'::timestamptz
),
(
  'PrivateEye',
  'https://www.privateeye.com',
  'https://www.privateeye.com/removal',
  'people_search', 'medium', 'US',
  NULL,
  false, false, false, false,
  false, 'manual',
  'Go to privateeye.com/removal. Fill out the form with your name, state, and email. A link to the complete removal form will be sent to your email address. Follow the link to finish the process.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'SearchPeopleFree',
  'https://www.searchpeoplefree.com',
  'https://www.searchpeoplefree.com/opt-out',
  'people_search', 'medium', 'US',
  'privacy@searchpeoplefree.com',
  false, false, false, false,
  false, 'manual',
  'Go to searchpeoplefree.com/opt-out. Search your name multiple ways (with/without middle name, different states) to find all listings. Select each record and submit the removal form. No verification required.',
  '["first_name","last_name","state"]'::jsonb,
  1, 14, true, '2026-06-09'::timestamptz
),
(
  'United States Phone Book',
  'https://www.unitedstatesphonebook.com',
  'https://www.unitedstatesphonebook.com/contact.php',
  'people_search', 'medium', 'US',
  NULL,
  false, false, false, false,
  false, 'manual',
  'Go to unitedstatesphonebook.com/contact.php. Enter your phone number and zip code in the removal request form.',
  '["first_name","last_name","phone","zip"]'::jsonb,
  1, 14, true, '2026-06-09'::timestamptz
),
(
  'ZoomInfo',
  'https://www.zoominfo.com',
  'https://privacyrequest.zoominfo.com/remove/verify',
  'marketing_data', 'medium', 'US',
  NULL,
  true, false, false, false,
  false, 'manual',
  'Go to privacyrequest.zoominfo.com/remove/verify. Enter your email address and submit. A verification code will be sent to your email. Enter the code to access the removal form.',
  '["first_name","last_name","email"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),

-- ============================================================
-- PEOPLE-SEARCH — LOW PRIORITY / SPECIAL REQUIREMENTS
-- ============================================================

(
  'SpyFly',
  'https://www.spyfly.com',
  'https://www.spyfly.com/help-center/remove-my-public-record',
  'people_search', 'low', 'US',
  'privacyinfo@spyfly.com',
  false, false, false, true,
  false, 'manual',
  'Go to spyfly.com/help-center/remove-my-public-record. Provide your name, age, and address. May require payment or account signup. Alternatively, email privacyinfo@spyfly.com directly with a removal request.',
  '["first_name","last_name","city","state"]'::jsonb,
  3, 14, true, '2026-06-09'::timestamptz
),
(
  'Searchbug',
  'https://www.searchbug.com',
  'https://www.searchbug.com/contact-us.aspx',
  'people_search', 'low', 'US',
  NULL,
  false, true, false, true,
  false, 'manual',
  'Contact Searchbug via searchbug.com/contact-us.aspx to request a data block. Credit card required to access the full service. Phone or email contact may be needed to process the removal request.',
  '["first_name","last_name","state"]'::jsonb,
  4, 30, true, '2026-06-09'::timestamptz
),
(
  'Archives.com',
  'https://www.archives.com',
  'https://www.archives.com/Optout',
  'public_records', 'low', 'US',
  NULL,
  false, false, false, false,
  false, 'manual',
  'A free trial account at archives.com is required before opting out. Sign up for a free trial, then go to archives.com/Optout and submit the removal request.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 14, true, '2026-06-09'::timestamptz
),
(
  'FreePeopleDirectory',
  'https://freepeopledirectory.com',
  'https://www.spokeo.com/optout',
  'people_search', 'low', 'US',
  NULL,
  true, false, false, true,
  false, 'manual',
  'FreePeopleDirectory uses the Spokeo opt-out system. Go to spokeo.com/optout, search for your name and city, select your record, and submit. Email confirmation and possibly a $1 identity verification charge may apply.',
  '["first_name","last_name","city","state","email"]'::jsonb,
  3, 7, true, '2026-06-09'::timestamptz
),

-- ============================================================
-- GENEALOGY
-- ============================================================

(
  'Ancestry.com',
  'https://www.ancestry.com',
  NULL,
  'genealogy', 'medium', 'US',
  'privacy@ancestry.com',
  false, false, false, false,
  false, 'manual',
  'Create a free Ancestry account. Search for records about yourself. For each listing, copy the URL and email privacy@ancestry.com requesting removal of those specific pages. A free account is required to access the privacy form.',
  '["first_name","last_name","state"]'::jsonb,
  2, 30, true, '2026-06-09'::timestamptz
),
(
  'FamilySearch',
  'https://www.familysearch.org',
  'https://submit-irm.trustarc.com/services/validation/a9a9d27e-7b07-4db5-a7d4-27e00ebef4d7',
  'genealogy', 'low', 'US',
  NULL,
  true, false, false, false,
  false, 'manual',
  'Create a free FamilySearch account and locate the historical records you want removed. Copy the URLs of those records. Submit a removal request via the TrustArc privacy form at the opt-out URL, providing the URLs. Email verification is required.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 30, true, '2026-06-09'::timestamptz
),

-- ============================================================
-- FACIAL RECOGNITION
-- ============================================================

(
  'PimEyes',
  'https://pimeyes.com',
  'https://pimeyes.com/en/opt-out-request-form',
  'facial_recognition', 'medium', 'Global',
  NULL,
  true, false, true, false,
  false, 'manual',
  'Go to pimeyes.com/en/opt-out-request-form. Upload a clear face photo and a government-issued ID with sensitive data (ID number, DOB) blacked out. Submit the form and confirm via email. Used by stalkers and others to reverse-search faces.',
  '["first_name","last_name","email"]'::jsonb,
  4, 14, true, '2026-06-09'::timestamptz
),
(
  'Facecheck ID',
  'https://facecheck.id',
  'https://facecheck.id/Face-Search/RemoveMyPhotos',
  'facial_recognition', 'medium', 'Global',
  NULL,
  true, false, true, false,
  false, 'manual',
  'Go to facecheck.id/Face-Search/RemoveMyPhotos. Upload a face photo and a government-issued ID with sensitive data blurred. Submit the opt-out form and confirm via email.',
  '["first_name","last_name","email"]'::jsonb,
  4, 14, true, '2026-06-09'::timestamptz
),
(
  'Clearview AI',
  'https://www.clearview.ai',
  'https://www.clearview.ai/privacy-and-requests',
  'facial_recognition', 'medium', 'Global',
  'legal@clearview.ai',
  true, false, false, false,
  false, 'manual',
  'Go to clearview.ai/privacy-and-requests. Submit a privacy rights request to remove your face data. Email verification is required. Clearview AI is used by law enforcement and private investigators for facial recognition searches.',
  '["first_name","last_name","email"]'::jsonb,
  3, 30, true, '2026-06-09'::timestamptz
),

-- ============================================================
-- MARKETING DATA BROKERS
-- Major aggregators that feed downstream people-search sites.
-- ============================================================

(
  'Acxiom',
  'https://www.acxiom.com',
  'https://isapps.acxiom.com/optout/optout.aspx',
  'marketing_data', 'high', 'Global',
  'consumeradvo@acxiom.com',
  true, false, false, false,
  false, 'manual',
  'Go to isapps.acxiom.com/optout/optout.aspx (US opt-out). Submit your name, address, and email. Email verification may be required. Also check acxiom.com/what-we-are-thinking/california-consumer-privacy-act/for-consumers/ for additional opt-out options. One of the largest consumer data brokers worldwide.',
  '["first_name","last_name","state","email"]'::jsonb,
  3, 30, true, '2026-06-09'::timestamptz
),
(
  'Experian Marketing Services',
  'https://www.experian.com',
  'https://www.experian.com/privacy/opting_out',
  'marketing_data', 'medium', 'Global',
  'privacy@experian.com',
  false, false, false, false,
  false, 'manual',
  'Go to experian.com/privacy/opting_out. Submit your information to opt out of Experian''s marketing data programs. This covers marketing data only — not credit reporting. Also see optoutprescreen.com for credit offer opt-out.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 30, true, '2026-06-09'::timestamptz
),
(
  'Epsilon Data Management',
  'https://www.epsilon.com',
  'https://legal.epsilon.com/dsr/',
  'marketing_data', 'medium', 'Global',
  'privacy@epsilon.com',
  false, false, false, false,
  false, 'manual',
  'Go to legal.epsilon.com/dsr/. Submit a data subject rights request to opt out of Epsilon''s marketing database. Epsilon is one of the largest marketing data companies globally, supplying data to many downstream brokers.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 30, true, '2026-06-09'::timestamptz
),
(
  'LiveRamp',
  'https://liveramp.com',
  'https://liveramp.com/opt_out/',
  'marketing_data', 'medium', 'Global',
  'privacy@liveramp.com',
  false, false, false, false,
  false, 'manual',
  'Go to liveramp.com/opt_out/. Submit the opt-out form. LiveRamp links consumer identities across advertising platforms and feeds many downstream data brokers.',
  '["first_name","last_name","email"]'::jsonb,
  2, 30, true, '2026-06-09'::timestamptz
),
(
  'Equifax Marketing Services',
  'https://www.equifax.com',
  'https://www.equifax.com/personal/education/identity/opt-out-prescreen/',
  'marketing_data', 'medium', 'Global',
  'privacy@equifax.com',
  false, false, false, false,
  false, 'manual',
  'Go to equifax.com/personal/education/identity/opt-out-prescreen/. This opts you out of Equifax''s marketing/prescreen programs. Note: this is separate from credit freeze and covers marketing data use only.',
  '["first_name","last_name","state","email"]'::jsonb,
  2, 30, true, '2026-06-09'::timestamptz
)

;
