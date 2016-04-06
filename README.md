# bra_styleguide-widget
This widget generates an online style guide within the Capitan workflow

## Show Single Component
To show only a single component per default on document load, you can trigger this by setting the GET parameter 'comp'.

```
/?comp=alert
```

## Hide Widget
To hide the widget, just set the GET parameter 'hide' to 'true'.

```
/?hide=true
```

## Delete hidden components
You can delete the hidden components by following GET parameter 'delete=true'.
Useful for iframe actions within the capitan-builder.

```
/?delete=true
```
