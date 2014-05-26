#!/bin/sh
# Creates a zip file to upload to google chrome developer dashboard.

zip -r Tabula.zip * -x screenshots/* -x *.zip -x *~

