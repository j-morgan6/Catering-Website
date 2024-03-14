# Catering-API

</br>

# Getting Started

## Prerequisites
This website is built using NodeJS. If you do not have NodeJS installed on your local machine, you can get it **[here](https://nodejs.org/en/download)**

## Installation

### 1. Clone the repository
To clone the repository using [git](https://git-scm.com/downloads), use the `git clone` command.
</br>
A `.zip` file can also be downloaded from the GitHub repository.

### 2. Install Dependencies
To install all required project dependencies listed in `package.json`, run `npm install` inside the project directory.

</br>

# Contributing

## Pushing Changes to the Repository
This repository has two protected branches: `main` and `dev`. The `main` branch stores working code ready for deployment, while the `dev` branch contains code ready for integration testing.
</br></br>
**DO NOT** push code directly to these branches. Instead, commit new features and bug fixes to new branches and merge them with dev using a *pull request*.
</br></br>
New feature and bug fix branches should not be merged into `main` directly. Instead, these branches should be merged into `dev` to undergo integration testing before being pushed to `main`.


## Pull Requests
A pull request must be made to merge changes into either `main` or `dev`. When creating a pull request, provide a detailed description of the changes. Whenever possible, have the pull request reviewed by at least one other contributor before merging the code into a protected branch.