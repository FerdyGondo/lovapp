# Dynatrace

[https://www.dynatrace.com](https://www.dynatrace.com/)

Dynatrace provides the next generation intelligent application, service and infrastructure monitoring
platform.

[![CocoaPods](https://img.shields.io/badge/pod-7.1-blue.svg)](https://cocoapods.org/pods/Dynatrace)
[![Carthage compatible](https://img.shields.io/badge/Carthage-compatible-4BC51D.svg?style=flat)](https://files.dynatrace.com/mobileagent/carthage/dynatrace.json)
![License](https://img.shields.io/badge/license-Commercial-lightgrey.svg)

## Contents

* [Features](#features)
* [Installation](#installation)
* [Requirements](#requirements)
* [Documentation](#documentation)

## Features

* Intelligent application, service and infrastructure monitoring
* No manual setup required


## Installation

### Install for Dynatrace AppMon
For AppMon configure your Podfile to use a 7.x version of the Dynatrace iOS agent as this is compatible with AppMon environments from 6.5 and higher.

Include Dynatrace in your Podfile:

```ruby
use_frameworks!
pod 'Dynatrace', '~> 7'
```

If you want to use the Dynatrace static library please include the spec `Dynatrace/lib` in your Podfile:

```ruby
pod 'Dynatrace/lib', '~> 7'
```

### Install for Dynatrace SaaS/Managed
Include Dynatrace in your Podfile:

```ruby
use_frameworks!
pod 'Dynatrace'
```

If you want to use the Dynatrace static library please include the spec `Dynatrace/lib` in your Podfile:

```ruby
pod 'Dynatrace/lib'
```

## Requirements

* Project targeting iOS 8+ with the framework, iOS 6+ with the static library

## Documentation

Detailed documentation can be found here: [Dynatrace Documentation](https://www.dynatrace.com/support/doc/)
