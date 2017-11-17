# T-rex timetravel

Demo frontend application created for [Tooploox](https://www.tooploox.com/) Open Office - Halloween Style Day.

## Inspiration

T-Rex timetravel was inspired by Chrome T-rex Game, but additional feature of `time manipulation` (using redux-style and Immutable state) was added.
Moreover simple `physics engine` was also designed with support of Newton's laws of motion.

This part is rewritten version to show version with more parenthesis

![chrome offline game cast](screenshot.gif)


## How to play

`↑` to jump

`↓` to duck (bend down)

`space` to pause time

`r` to reverse time

## Development

### On the host machine

Install the `boot`:

    brew install boot-clj

Run `dev` server:

    boot dev


Application should start on http://localhost:3000/.

## Testing

### On the host machine

    boot auto-test

## Built With

* ClojureScript
