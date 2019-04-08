# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.0.0-beta5] - 2019-04-08
### Added
 - possible to save favorite choices in dropdown
 
### Removed
 - GS validation [#29](https://github.com/ecatch-kyst/backend/issues/29)

## [1.0.0-beta4] - 2019-03-25
### Added
- POR message created and being sent to Dualog mock
- mock boat created for each registered user
- when deleting a user, delete its boat and corresponding messages

### Fixed
- Several bugs with message creation
- Several bugs with valdation of fields

### Changed
- Firestore rules modified to support POR messages

### Fixed
- RN is now added to messages

## [1.0.0-beta2] - 2019-02-26
### Added
- DEP message is handled in every step (firestore, cloud function and dualog mock)
- firestore rules
- changes to message creation according to frontend changes
- validate message
- forward message on create
- user create event
- user delete event


## [0.1.0] - 2019-01-30
### Added
- moved backend logic from [balazsorban44/ecatch-it2901](https://github.com/balazsorban44/ecatch-it2901)


The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
