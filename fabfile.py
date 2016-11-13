# -*- coding: utf-8 -*-

from __future__ import division, print_function, unicode_literals

import os

from fabric.api import cd, env, run

# We can then specify host(s) and run the same commands across those systems
env.user = 'humitos'
env.hosts = ['elblogdehumitos.com']
env.shell = '/bin/bash -l -c'
env.colorize_errors = True
env.project = '/home/humitos/apps/osm-pois'


def production():
    with cd(env.project):
        run('git pull')


def testing():
    with cd(os.path.join(env.project, 'master')):
        run('git pull')
