<h1 class="page-title">Contributing</h1>

Do you use the NPMap library, and want to help add features or fix bugs? Thanks! First, though, please take a look at the guidelines below. Following them will ensure that your contriubtion can make it into the library quickly and with minimal effort.

## Reporting issues

A bug is a _demonstrable problem_. Please read the following guidance before [reporting an issue](https://github.com/nationalparkservice/npmap/issues/):

1. Before reporting an issue, use the search to see if the issue has already been reported. If it already exists, do not open a new issue - simply comment on the existing one.
2. Isolate the problem and ensure that the issue is in the NPMap library itself and not in your code.
3. Create a [reduced test case](http://css-tricks.com/6263-reduced-test-cases/).
4. If possible, provide a link to a live example. You can use [jsFiddle](http://jsfiddle.net) to host examples.

Please try to be as detailed as possible in your report. What is your environment? What steps will reproduce the issue? What browser(s) can you reproduce the problem in? All these details will make it easier for NPMap contributors to assess and fix any potential issues.

### Example of a good bug report:

> Short and descriptive title
>
> A summary of the issue and the environment in which it occurs. If applicable, include the steps required to reproduce the bug:
>
> 1. First step
> 2. Second step
> 3. Etc.
>
> `<url>` (a link to the reduced test case)
>
> Any other information you want to share that is relevant to the issue being reported. This might include the file name and line numbers of the code that is causing the bug and potential solutions.

A good bug report should be clear and to the point, and should provide enough information for an NPMap contributor to assess and/or fix the bug without coming back to you for more information.

## Pull requests

We encourage you to submit pull requests! These requests should remain focused in scope and should not contain unrelated commits.

If your contribution involves a significant amount of work or substantial changes to any part of the library, please open an issue to discuss it first.

Please follow this process. It's the best way to get your work included in the project:

1. [Fork](http://help.github.com/fork-a-repo/) the project.
2. Clone your fork (`git clone https://github.com/<your-username>/npmap.git`).
3. Add an `upstream` remote (`git remote add upstream https://github.com/nationalparkservice/npmap.git`).
4. Get the latest changes from upstream (e.g. `git pull upstream <dev-branch>`).
5. Create a new topic branch to contain your feature, change, or fix (`git checkout -b <topic-branch-name>`).
6. Make sure that your changes adhere to the current coding conventions used throughout the project - indentation, commenting, etc.
7. Commit your changes in logical chunks. Use git's [interactive rebase](https://help.github.com/articles/interactive-rebase) feature to tidy up your commits before making them public. Please adhere to these [git commit message guidelines](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html) or your pull request may not be merged into the main project.
8. Locally merge (or rebase) the upstream branch into your topic branch.
9. Push your topic branch up to your fork (`git push origin <topic-branch-name>`).
10. [Open a Pull Request](http://help.github.com/send-pull-requests/) with a clear title and description. Please mention which browsers you tested in.