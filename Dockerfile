# Use an official Ruby image as a parent image
FROM ruby:2.5.5

RUN apt-get update && apt-get install nodejs npm postgresql-client vim  -y
RUN npm install -g yarn

# Install bundler
RUN gem install bundler -v 2.3.27

# Set the working directory within the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install the dependencies specified in your Gemfile
RUN bundle install

RUN npm install
RUN /usr/local/bin/yarn

# Add a script to be executed every time the container starts
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# Expose the port your app runs on
EXPOSE 3000

# Configure the main process to run when running the image
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
